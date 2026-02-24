import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../data/repositories/doctor_repository_impl.dart';
import '../../domain/models/medical_professional_model.dart';
import '../../data/models/branch_setting_model.dart';
import '../../domain/repositories/branch_setting_repository.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../../data/models/appointment_model.dart';

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
  DoctorSchedulePickerController(
    this._doctorRepository,
    this._branchSettingRepository,
    this._appointmentRepository,
  );

  final DoctorRepository _doctorRepository;
  final BranchSettingRepository _branchSettingRepository;
  final AppointmentRepository _appointmentRepository;

  // Loading states
  final isLoadingDoctors = false.obs;
  final isLoadingSchedules = false.obs;
  final isLoadingBranches = false.obs;
  final isLoadingAppointments = false.obs;

  // Data
  final doctors = <MedicalProfessional>[].obs;
  // Private store for all doctors (before filtering)
  final _allDoctors = <MedicalProfessional>[];
  final schedulesForSelectedDoctor = <DoctorSchedule>[].obs;
  final existingAppointments = <AppointmentModel>[].obs;
  final branches = <BranchSettingModel>[].obs;

  // Service-specific data (passed from service detail page)
  List<MedicalProfessional>? _serviceDoctors;
  List<BranchSettingModel>? _serviceBranches;

  // Selection
  // Selection
  final selectedBranch = Rxn<BranchSettingModel>();
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
  /// Can optionally accept service-specific doctors and branches
  Future<void> init({
    int? serviceDurationInMinutes,
    List<MedicalProfessional>? serviceDoctors,
    List<BranchSettingModel>? serviceBranches,
  }) async {
    _serviceDurationInMinutes = serviceDurationInMinutes;
    _serviceDoctors = serviceDoctors;
    _serviceBranches = serviceBranches;

    // Load branches and doctors sequentially
    await loadBranches();
    await loadDoctors();

    // Auto-select branch AFTER both are loaded
    if (branches.length == 1 &&
        selectedBranch.value == null &&
        _allDoctors.isNotEmpty) {
      selectBranch(branches.first);
    }
  }

  Future<void> loadBranches() async {
    isLoadingBranches.value = true;
    try {
      // Use service-specific branches if provided, otherwise fetch all
      if (_serviceBranches != null && _serviceBranches!.isNotEmpty) {
        branches.assignAll(_serviceBranches!);
      } else {
        final list = await _branchSettingRepository.getBranchSettings();
        branches.assignAll(list);
      }

      // Don't auto-select here - let loadDoctors handle it after doctors are loaded
    } catch (e) {
      // Error loading branches
    } finally {
      isLoadingBranches.value = false;
    }
  }

  Future<void> loadDoctors() async {
    errorMessage.value = null;
    isLoadingDoctors.value = true;
    try {
      // Use service-specific doctors if provided, otherwise fetch all
      List<MedicalProfessional> list;
      if (_serviceDoctors != null && _serviceDoctors!.isNotEmpty) {
        list = _serviceDoctors!;
      } else {
        list = await _doctorRepository.getDoctors();
      }

      final activeDoctors = list.where((d) => d.isActive).toList();

      _allDoctors.clear();
      _allDoctors.addAll(activeDoctors);

      // IMPORTANT: After loading doctors, re-apply branch filter if branch is already selected
      final currentBranch = selectedBranch.value;
      if (currentBranch != null) {
        // Temporarily clear the selected branch to force re-filtering
        selectedBranch.value = null;
        selectBranch(currentBranch);
      } else {
        // If no branch selected yet, doctors list remains empty
        // Requirement: "choose branch first then fetch doctors".
        doctors.clear();
      }

      /*
      // If only one doctor, auto-select it to reduce friction.
      if (doctors.length == 1) {
        await selectDoctor(doctors.first);
      }
      */
    } catch (e) {
      errorMessage.value = 'Failed to load doctors.';
      // Keep a dev-friendly log.
      // ignore: avoid_print
      print('loadDoctors error: $e');
    } finally {
      isLoadingDoctors.value = false;
    }
  }

  void selectBranch(BranchSettingModel branch) {
    if (selectedBranch.value?.id == branch.id) {
      return;
    }

    selectedBranch.value = branch;

    // Filter doctors based on branch
    final filtered = <MedicalProfessional>[];

    for (int i = 0; i < _allDoctors.length; i++) {
      final doctor = _allDoctors[i];

      if (doctor.branches == null || doctor.branches!.isEmpty) {
        filtered.add(doctor);
      } else {
        final hasMatchingBranch = doctor.branches!.any(
          (b) => b.id == branch.id,
        );
        if (hasMatchingBranch) {
          filtered.add(doctor);
        }
      }
    }

    doctors.assignAll(filtered);

    // If only one doctor, auto-select
    if (doctors.length == 1) {
      selectDoctor(doctors.first);
    } else {
      selectedDoctor.value = null;
    }

    // Reset downstream selections
    selectedDate.value = null;
    selectedTime.value = null;
    availableDates.clear();
    availableTimes.clear();
    schedulesForSelectedDoctor.clear();
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
    existingAppointments.clear();

    // Load both schedules and existing appointments
    await Future.wait([
      _loadSchedulesForDoctor(doctor.id),
      _loadExistingAppointments(doctor.id),
    ]);

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
      selectedBranch.value != null &&
      selectedDoctor.value != null &&
      selectedDate.value != null &&
      selectedTime.value != null;

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
    selectedBranch.value = null;
    selectedDoctor.value = null;
    selectedDate.value = null;
    selectedTime.value = null;
    schedulesForSelectedDoctor.clear();
    existingAppointments.clear();
    availableDates.clear();
    availableTimes.clear();
    doctors.clear();
    _allDoctors.clear();
    branches.clear();
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

      // Filter schedules by selected branch
      final branchId = selectedBranch.value?.id;
      if (branchId != null) {
        schedulesForSelectedDoctor.assignAll(
          active
              .where(
                (s) =>
                    s.branchSettingId == branchId || s.branchSettingId == null,
              )
              .toList(),
        );
      } else {
        schedulesForSelectedDoctor.assignAll(active);
      }
    } catch (e) {
      errorMessage.value = 'Failed to load schedule for this doctor.';
      // ignore: avoid_print
      print('_loadSchedulesForDoctor error: $e');
    } finally {
      isLoadingSchedules.value = false;
    }
  }

  Future<void> _loadExistingAppointments(int doctorId) async {
    isLoadingAppointments.value = true;

    try {
      final appointments = await _appointmentRepository
          .getAppointmentsByDoctorId(doctorId);

      // Filter to only future appointments (past appointments don't block slots)
      final now = DateTime.now();
      final futureAppointments = appointments.where((appointment) {
        try {
          // Parse the appointment date/time
          DateTime? appointmentDateTime;

          // Try to parse from reservationTime field
          if (appointment.reservationTime.isNotEmpty) {
            appointmentDateTime = DateTime.tryParse(
              appointment.reservationTime,
            );
          }

          // If that fails, try to construct from day field
          if (appointmentDateTime == null && appointment.day.isNotEmpty) {
            appointmentDateTime = DateTime.tryParse(appointment.day);
          }

          if (appointmentDateTime != null) {
            return appointmentDateTime.isAfter(now);
          }

          return false; // Skip appointments we can't parse
        } catch (e) {
          return false;
        }
      }).toList();

      existingAppointments.assignAll(futureAppointments);
    } catch (e) {
      // Don't show error to user - just continue with empty appointments list
      existingAppointments.clear();
    } finally {
      isLoadingAppointments.value = false;
    }
  }

  void _recomputeAvailableDates() {
    availableDates.clear();
    availableTimes.clear();
    selectedDate.value = null;
    selectedTime.value = null;

    final schedules = schedulesForSelectedDoctor;
    if (schedules.isEmpty) {
      return;
    }

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

      for (
        var day = clampedStart;
        !day.isAfter(clampedEnd);
        day = day.add(const Duration(days: 1))
      ) {
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

    // NEW: Remove slots that are already booked by existing appointments
    final availableSlots = _filterOutBookedSlots(list, date);

    availableTimes.assignAll(availableSlots);

    // Auto-select first available time.
    if (availableTimes.isNotEmpty) {
      selectedTime.value = availableTimes.first;
    }
  }

  /// Filters out time slots that are already booked by existing appointments
  List<TimeOfDay> _filterOutBookedSlots(
    List<TimeOfDay> allSlots,
    DateTime date,
  ) {
    final bookedSlots = <TimeOfDay>{};

    // Find all booked slots for this specific date
    for (final appointment in existingAppointments) {
      try {
        DateTime? appointmentDateTime;

        // Try to parse from reservationTime field
        if (appointment.reservationTime.isNotEmpty) {
          appointmentDateTime = DateTime.tryParse(appointment.reservationTime);
        }

        // If that fails, try to construct from day field
        if (appointmentDateTime == null && appointment.day.isNotEmpty) {
          appointmentDateTime = DateTime.tryParse(appointment.day);
        }

        if (appointmentDateTime != null &&
            _isSameDate(appointmentDateTime, date)) {
          final bookedTime = TimeOfDay(
            hour: appointmentDateTime.hour,
            minute: appointmentDateTime.minute,
          );
          bookedSlots.add(bookedTime);
        }
      } catch (e) {
        // Error parsing appointment time
      }
    }

    // Filter out booked slots
    final availableSlots = allSlots.where((slot) {
      return !bookedSlots.any(
        (booked) => booked.hour == slot.hour && booked.minute == slot.minute,
      );
    }).toList();

    return availableSlots;
  }

  List<TimeOfDay> _buildTimeSlotsForScheduleOnDate(
    DoctorSchedule schedule,
    DateTime date,
  ) {
    final from = _parseTimeOfDay(schedule.startTime);
    final to = _parseTimeOfDay(schedule.endTime);

    if (from == null || to == null) {
      return const [];
    }

    final fromMin = _timeToMinutes(from);
    final toMin = _timeToMinutes(to);

    // If end is not after start, treat as invalid.
    if (toMin <= fromMin) {
      return const [];
    }

    // Use 90 minutes (1:30) as requested
    final slotMinutes = 90;

    // Build slots [start, end) with step = slotMinutes.
    final slots = <TimeOfDay>[];
    for (var m = fromMin; m + slotMinutes <= toMin; m += slotMinutes) {
      final slot = _minutesToTime(m);
      slots.add(slot);
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
  /// - "2:00" -> 2:00 AM
  /// - "14:00" -> 2:00 PM
  /// - "09:00:00" -> 9:00 AM
  /// - "2025-01-01T09:00:00" -> 9:00 AM
  TimeOfDay? _parseTimeOfDay(String? value) {
    if (value == null) return null;
    final v = value.trim();
    if (v.isEmpty) return null;

    // Try ISO DateTime first
    final dt = DateTime.tryParse(v);
    if (dt != null) {
      return TimeOfDay(hour: dt.hour, minute: dt.minute);
    }

    // Try HH:mm(:ss) format
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
