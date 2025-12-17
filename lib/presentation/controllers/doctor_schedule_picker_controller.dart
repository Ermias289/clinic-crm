import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../data/repositories/doctor_repository_impl.dart';
import '../../domain/models/medical_professional_model.dart';

/// Controls a "pick doctor -> pick date -> pick time" flow.
///
/// Key behavior:
/// - Loads doctors from `/api/MedicalProfessional`
/// - Loads schedules from `/api/DoctorSchedule` and filters by selected doctor
/// - Builds a list of available dates & times based on schedule rules
/// - Forces user to pick only from available schedule-derived options
///
/// Notes:
/// - The backend schedule schema can vary. This controller is defensive:
///   it uses `DoctorSchedule.dayOfWeek`, `startTime`, `endTime`,
///   and (optionally) `startDate`/`endDate` when present.
/// - If `slotDurationInMinutes` is missing on schedule, the controller will
///   fall back to `serviceDurationInMinutes` if provided, otherwise 30 minutes.
class DoctorSchedulePickerController extends GetxController {
  DoctorSchedulePickerController(this._doctorRepository);

  final DoctorRepository _doctorRepository;

  // Loading states
  final isLoadingDoctors = false.obs;
  final isLoadingSchedules = false.obs;

  // Data
  final doctors = <MedicalProfessional>[].obs;
  final schedulesForSelectedDoctor = <DoctorSchedule>[].obs;

  // Selection
  final selectedDoctor = Rxn<MedicalProfessional>();
  final selectedDate = Rxn<DateTime>(); // date only (yyyy-mm-dd)
  final selectedTime = Rxn<TimeOfDay>();

  // Availability (derived)
  final availableDates = <DateTime>[].obs; // date only
  final availableTimes = <TimeOfDay>[].obs;

  // Optional constraints
  int? _serviceDurationInMinutes;

  // User-friendly error
  final errorMessage = RxnString();

  /// Initialize controller by loading doctors.
  Future<void> init({int? serviceDurationInMinutes}) async {
    _serviceDurationInMinutes = serviceDurationInMinutes;
    await loadDoctors();
  }

  Future<void> loadDoctors() async {
    errorMessage.value = null;
    isLoadingDoctors.value = true;
    try {
      final list = await _doctorRepository.getDoctors();
      doctors.assignAll(list.where((d) => d.isActive).toList());

      // If only one doctor, auto-select it to reduce friction.
      if (doctors.length == 1) {
        await selectDoctor(doctors.first);
      }
    } catch (e) {
      errorMessage.value = 'Failed to load doctors.';
      // Keep a dev-friendly log.
      // ignore: avoid_print
      print('loadDoctors error: $e');
    } finally {
      isLoadingDoctors.value = false;
    }
  }

  Future<void> selectDoctor(MedicalProfessional doctor) async {
    if (selectedDoctor.value?.id == doctor.id) return;

    selectedDoctor.value = doctor;

    // Reset downstream selections
    selectedDate.value = null;
    selectedTime.value = null;
    availableDates.clear();
    availableTimes.clear();
    schedulesForSelectedDoctor.clear();

    await _loadSchedulesForDoctor(doctor.id);
    _recomputeAvailableDates();
  }

  void selectDate(DateTime date) {
    final normalized = _dateOnly(date);
    selectedDate.value = normalized;
    selectedTime.value = null;

    _recomputeAvailableTimesForDate(normalized);
  }

  void selectTime(TimeOfDay time) {
    selectedTime.value = time;
  }

  bool get canContinue =>
      selectedDoctor.value != null && selectedDate.value != null && selectedTime.value != null;

  /// Returns a combined DateTime for the selected date + time (local time),
  /// or null if incomplete.
  DateTime? get selectedDateTime {
    final d = selectedDate.value;
    final t = selectedTime.value;
    if (d == null || t == null) return null;
    return DateTime(d.year, d.month, d.day, t.hour, t.minute);
  }

  /// Clears all selections (doctor included).
  void resetAll() {
    selectedDoctor.value = null;
    selectedDate.value = null;
    selectedTime.value = null;
    schedulesForSelectedDoctor.clear();
    availableDates.clear();
    availableTimes.clear();
    errorMessage.value = null;
  }

  // -------------------------
  // Schedules -> availability
  // -------------------------

  Future<void> _loadSchedulesForDoctor(int doctorId) async {
    errorMessage.value = null;
    isLoadingSchedules.value = true;

    try {
      final schedules = await _doctorRepository.getSchedulesForDoctor(doctorId);

      // Only keep active schedules (if field exists; our model defaults to true).
      final active = schedules.where((s) => s.isActive).toList();

      schedulesForSelectedDoctor.assignAll(active);
    } catch (e) {
      errorMessage.value = 'Failed to load schedule for this doctor.';
      // ignore: avoid_print
      print('_loadSchedulesForDoctor error: $e');
    } finally {
      isLoadingSchedules.value = false;
    }
  }

  void _recomputeAvailableDates() {
    availableDates.clear();
    availableTimes.clear();
    selectedDate.value = null;
    selectedTime.value = null;

    final schedules = schedulesForSelectedDoctor;
    if (schedules.isEmpty) return;

    final now = DateTime.now();
    final start = _dateOnly(now);
    final end = _dateOnly(now.add(const Duration(days: 365)));

    final dates = <DateTime>{};

    // Strategy:
    // - If schedule provides date range -> add dates within that range
    // - Else use dayOfWeek rule (if any) within default window (next 365 days)
    //
    // IMPORTANT: We only expose dates that have at least one valid time slot.
    for (final schedule in schedules) {
      final scheduleStart = _dateOnly(schedule.startDate ?? start);
      final scheduleEnd = _dateOnly(schedule.endDate ?? end);

      final clampedStart = scheduleStart.isAfter(start) ? scheduleStart : start;
      final clampedEnd = scheduleEnd.isBefore(end) ? scheduleEnd : end;

      if (clampedStart.isAfter(clampedEnd)) continue;

      // If dayOfWeek is provided, only include matching days.
      final targetDow = _parseDayOfWeek(schedule.dayOfWeek);

      for (var day = clampedStart;
          !day.isAfter(clampedEnd);
          day = day.add(const Duration(days: 1))) {
        if (targetDow != null && day.weekday != targetDow) continue;

        // Only add the date if it has at least one available slot.
        final slots = _buildTimeSlotsForScheduleOnDate(schedule, day);
        if (slots.isNotEmpty) {
          dates.add(day);
        }
      }
    }

    final sorted = dates.toList()..sort((a, b) => a.compareTo(b));
    availableDates.assignAll(sorted);

    // Auto-select first available date for convenience.
    if (availableDates.isNotEmpty) {
      selectDate(availableDates.first);
    }
  }

  void _recomputeAvailableTimesForDate(DateTime date) {
    availableTimes.clear();
    selectedTime.value = null;

    final schedules = schedulesForSelectedDoctor;
    if (schedules.isEmpty) return;

    final slots = <TimeOfDay>{};

    for (final schedule in schedules) {
      // If dayOfWeek constraint exists, respect it.
      final targetDow = _parseDayOfWeek(schedule.dayOfWeek);
      if (targetDow != null && date.weekday != targetDow) continue;

      // If schedule has date bounds, respect them.
      final start = _dateOnly(schedule.startDate ?? date);
      final end = _dateOnly(schedule.endDate ?? date);
      if (date.isBefore(start) || date.isAfter(end)) continue;

      final scheduleSlots = _buildTimeSlotsForScheduleOnDate(schedule, date);
      slots.addAll(scheduleSlots);
    }

    final list = slots.toList()
      ..sort((a, b) => _timeToMinutes(a).compareTo(_timeToMinutes(b)));

    // Remove slots that are in the past (if user chose today).
    final now = DateTime.now();
    if (_isSameDate(date, now)) {
      list.removeWhere((t) {
        final dt = DateTime(date.year, date.month, date.day, t.hour, t.minute);
        // require at least a small lead time
        return dt.isBefore(now.add(const Duration(minutes: 5)));
      });
    }

    availableTimes.assignAll(list);

    // Auto-select first available time.
    if (availableTimes.isNotEmpty) {
      selectedTime.value = availableTimes.first;
    }
  }

  List<TimeOfDay> _buildTimeSlotsForScheduleOnDate(DoctorSchedule schedule, DateTime date) {
    final from = _parseTimeOfDay(schedule.startTime);
    final to = _parseTimeOfDay(schedule.endTime);

    if (from == null || to == null) return const [];

    final fromMin = _timeToMinutes(from);
    final toMin = _timeToMinutes(to);

    // If end is not after start, treat as invalid.
    if (toMin <= fromMin) return const [];

    final slotMinutes = schedule.slotDurationInMinutes ?? _serviceDurationInMinutes ?? 30;
    if (slotMinutes <= 0) return const [];

    // Build slots [start, end) with step = slotMinutes.
    final slots = <TimeOfDay>[];
    for (var m = fromMin; m + slotMinutes <= toMin; m += slotMinutes) {
      slots.add(_minutesToTime(m));
    }
    return slots;
  }

  // -------------------------
  // Helpers (parsing + utils)
  // -------------------------

  DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  bool _isSameDate(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  int _timeToMinutes(TimeOfDay t) => t.hour * 60 + t.minute;

  TimeOfDay _minutesToTime(int minutes) {
    final h = (minutes ~/ 60) % 24;
    final m = minutes % 60;
    return TimeOfDay(hour: h, minute: m);
  }

  /// Parses dayOfWeek from various possible backend values:
  /// - "Monday", "mon", "MONDAY"
  /// - "1".."7" (ISO weekday: Monday=1..Sunday=7)
  int? _parseDayOfWeek(String? value) {
    if (value == null) return null;
    final v = value.trim();
    if (v.isEmpty) return null;

    final asInt = int.tryParse(v);
    if (asInt != null && asInt >= 1 && asInt <= 7) return asInt;

    final lower = v.toLowerCase();

    if (lower.startsWith('mon')) return DateTime.monday;
    if (lower.startsWith('tue')) return DateTime.tuesday;
    if (lower.startsWith('wed')) return DateTime.wednesday;
    if (lower.startsWith('thu')) return DateTime.thursday;
    if (lower.startsWith('fri')) return DateTime.friday;
    if (lower.startsWith('sat')) return DateTime.saturday;
    if (lower.startsWith('sun')) return DateTime.sunday;

    return null;
  }

  /// Parses time from common backend formats:
  /// - "09:00"
  /// - "09:00:00"
  /// - "2025-01-01T09:00:00"
  TimeOfDay? _parseTimeOfDay(String? value) {
    if (value == null) return null;
    final v = value.trim();
    if (v.isEmpty) return null;

    // Try ISO DateTime
    final dt = DateTime.tryParse(v);
    if (dt != null) {
      return TimeOfDay(hour: dt.hour, minute: dt.minute);
    }

    // Try HH:mm(:ss)
    final parts = v.split(':');
    if (parts.length < 2) return null;

    final h = int.tryParse(parts[0]);
    final m = int.tryParse(parts[1]);
    if (h == null || m == null) return null;
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;

    return TimeOfDay(hour: h, minute: m);
  }

  /// Optional convenience: returns formatted state for debugging/logging.
  Map<String, dynamic> debugState() {
    return {
      'selectedDoctorId': selectedDoctor.value?.id,
      'selectedDoctorName': selectedDoctor.value?.fullName,
      'selectedDate': selectedDate.value?.toIso8601String(),
      'selectedTime': selectedTime.value == null
          ? null
          : '${selectedTime.value!.hour.toString().padLeft(2, '0')}:${selectedTime.value!.minute.toString().padLeft(2, '0')}',
      'availableDatesCount': availableDates.length,
      'availableTimesCount': availableTimes.length,
      'schedulesCount': schedulesForSelectedDoctor.length,
      'serviceDurationInMinutes': _serviceDurationInMinutes,
    };
  }
}
