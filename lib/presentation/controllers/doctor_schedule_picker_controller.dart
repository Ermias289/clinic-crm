import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../../domain/models/medical_service_model.dart';
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

  // Selection
  // Selection
  final selectedBranch = Rxn<BranchSettingModel>();
  final selectedDoctor = Rxn<MedicalProfessional>();
  final selectedDate = Rxn<DateTime>(); // date only (yyyy-mm-dd)
  final selectedTime = RxnString();

  // Availability (derived)
  final availableDates = <DateTime>[].obs; // date only
  final availableTimes = <String>[].obs;

  // Optional constraints
  int? _serviceDurationInMinutes;
  int? _serviceId;

  // Loading free slots
  final isLoadingFreeSlots = false.obs;

  // User-friendly error
  final errorMessage = RxnString();

  /// When [BranchSetting.id] does not match [DoctorSchedule.branchSettingId], the
  /// slot/booking APIs still need the id from the schedule rows (e.g. 1 not 45).
  int? _apiBranchIdFromSchedules;

  MedicalService? _service;

  /// Branch id to send to `getFreeSlots` and [Get.back] for `branchId` (backend key).
  int get apiBranchIdForBooking =>
      _apiBranchIdFromSchedules ?? selectedBranch.value!.id;

  /// Initialize controller by loading doctors.
  Future<void> init({required MedicalService service}) async {
    _service = service;
    _serviceDurationInMinutes = service.durationInMinutes;
    _serviceId = service.id;

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
      // Prioritize branches already embedded in the service object
      if (_service?.branches != null) {
        branches.assignAll(_dedupeBranches(_service!.branches!));
        return;
      }

      final list = await _branchSettingRepository.getBranchSettings();
      branches.assignAll(_dedupeBranches(list));

      // Don't auto-select here - let loadDoctors handle it after doctors are loaded
    } catch (e) {
      // Error loading branches
    } finally {
      isLoadingBranches.value = false;
    }
  }

  List<BranchSettingModel> _dedupeBranches(List<BranchSettingModel> source) {
    final seenIds = <int>{};
    final seenFallbackKeys = <String>{};
    final unique = <BranchSettingModel>[];

    for (final branch in source) {
      final id = branch.id;
      if (id > 0) {
        if (seenIds.add(id)) {
          unique.add(branch);
        }
        continue;
      }

      final fallbackKey = '${branch.name ?? ''}|${branch.address ?? ''}';
      if (seenFallbackKeys.add(fallbackKey)) {
        unique.add(branch);
      }
    }

    return unique;
  }

  Future<void> loadDoctors() async {
    errorMessage.value = null;
    isLoadingDoctors.value = true;
    try {
      final List<MedicalProfessional> list;

      // Prioritize doctors already embedded in the service object
      if (_service?.medicalProfessionals != null) {
        list = _service!.medicalProfessionals!;
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
    } catch (e) {
      errorMessage.value = 'Failed to load doctors.';
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
    _apiBranchIdFromSchedules = null;
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
    _apiBranchIdFromSchedules = null;
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

  Future<void> _recomputeAvailableTimesForDate(DateTime date) async {
    availableTimes.clear();
    selectedTime.value = null;

    // If we have all required IDs, fetch from API
    if (selectedDoctor.value != null &&
        selectedBranch.value != null &&
        _serviceId != null) {
      await _fetchFreeSlotsFromApi(
        selectedDoctor.value!.id,
        DateFormat('yyyy-MM-dd').format(date),
        apiBranchIdForBooking,
        _serviceId!,
      );
    } else {
      // API call required but missing IDs
      availableTimes.clear();
    }
  }

  Future<void> _fetchFreeSlotsFromApi(
    int docId,
    String dateStr,
    int branchId,
    int serviceId,
  ) async {
    isLoadingFreeSlots.value = true;
    try {
      final slots = await _appointmentRepository.getFreeSlots(
        docId,
        dateStr,
        branchId,
        serviceId,
      );

      availableTimes.assignAll(slots);

      if (availableTimes.isNotEmpty) {
        selectedTime.value = availableTimes.first;
      }
    } catch (e) {
      errorMessage.value = 'Failed to load available times from server.';
    } finally {
      isLoadingFreeSlots.value = false;
    }
  }

  void selectTime(String time) {
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

    final time = parseTimeOfDay(t);
    if (time == null) return null;

    return DateTime(d.year, d.month, d.day, time.hour, time.minute);
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
    _apiBranchIdFromSchedules = null;
  }

  // -------------------------
  // Schedules -> availability
  // -------------------------

  Future<void> _loadSchedulesForDoctor(int doctorId) async {
    errorMessage.value = null;
    isLoadingSchedules.value = true;

    try {
      final schedules = await _doctorRepository.getSchedulesForDoctor(doctorId);

      // API may return stray rows; only this doctor's schedules drive availability.
      final forDoctor = schedules
          .where((s) => s.medicalProfessionalId == doctorId)
          .toList();

      // Only keep active schedules (if field exists; our model defaults to true).
      final active = forDoctor.where((s) => s.isActive).toList();

      // Prefer schedules tied to the selected branch (or global when branch is null).
      final branchId = selectedBranch.value?.id;
      if (branchId != null) {
        final branchScoped = active
            .where(
              (s) => s.branchSettingId == branchId || s.branchSettingId == null,
            )
            .toList();
        // When BranchSetting ids and DoctorSchedule.branchSettingId disagree
        // (e.g. UI branch 45 vs schedule branch 1), still show availability instead
        // of an empty calendar.
        schedulesForSelectedDoctor.assignAll(
          branchScoped.isNotEmpty ? branchScoped : active,
        );
      } else {
        schedulesForSelectedDoctor.assignAll(active);
      }

      _apiBranchIdFromSchedules = _inferApiBranchIdFromSchedules(
        schedulesForSelectedDoctor,
        selectedBranch.value?.id,
      );
    } catch (e) {
      _apiBranchIdFromSchedules = null;
      errorMessage.value = 'Failed to load schedule for this doctor.';
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

        // If the schedule applies to this day, it's potentially available.
        dates.add(day);
      }
    }

    final sorted = dates.toList()..sort((a, b) => a.compareTo(b));
    availableDates.assignAll(sorted);

    // Auto-select first available date for convenience.
    if (availableDates.isNotEmpty) {
      selectDate(availableDates.first);
    }
  }

  // -------------------------
  // Helpers (parsing + utils)
  // -------------------------

  DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

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

  /// Picks the branch id the backend uses on schedules/slots when it differs from UI branch id.
  static int? _inferApiBranchIdFromSchedules(
    List<DoctorSchedule> schedules,
    int? uiSelectedBranchId,
  ) {
    if (schedules.isEmpty) return null;
    final ids = schedules
        .map((s) => s.branchSettingId)
        .whereType<int>()
        .toSet();
    if (ids.isEmpty) return null;
    if (uiSelectedBranchId != null && ids.contains(uiSelectedBranchId)) {
      return uiSelectedBranchId;
    }
    if (ids.length == 1) return ids.first;
    final counts = <int, int>{};
    for (final s in schedules) {
      final bid = s.branchSettingId;
      if (bid != null) counts[bid] = (counts[bid] ?? 0) + 1;
    }
    if (counts.isEmpty) return null;
    var bestId = counts.keys.first;
    var bestCount = counts[bestId]!;
    for (final e in counts.entries) {
      if (e.value > bestCount) {
        bestId = e.key;
        bestCount = e.value;
      }
    }
    return bestId;
  }

  /// Parses time from common backend formats:
  /// - "2:00" -> 2:00 AM
  /// - "14:00" -> 2:00 PM
  /// - "09:00:00" -> 9:00 AM
  /// - "2025-01-01T09:00:00" -> 9:00 AM
  TimeOfDay? parseTimeOfDay(String? value) {
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
      'selectedTime': selectedTime.value,
      'availableDatesCount': availableDates.length,
      'availableTimesCount': availableTimes.length,
      'schedulesCount': schedulesForSelectedDoctor.length,
      'serviceDurationInMinutes': _serviceDurationInMinutes,
    };
  }
}
