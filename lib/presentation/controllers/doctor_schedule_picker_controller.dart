import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../data/repositories/doctor_repository_impl.dart';
import '../../domain/models/medical_professional_model.dart';
import '../../data/models/branch_setting_model.dart';
import '../../domain/repositories/branch_setting_repository.dart';
import '../../domain/models/medical_service_model.dart';

/// Controls a "pick doctor -> pick date -> pick time" flow.
class DoctorSchedulePickerController extends GetxController {
  DoctorSchedulePickerController(
    this._doctorRepository,
    this._branchSettingRepository,
  );

  final DoctorRepository _doctorRepository;
  final BranchSettingRepository _branchSettingRepository;

  // Loading states
  final isLoadingDoctors = false.obs;
  final isLoadingSchedules = false.obs;
  final isLoadingBranches = false.obs;
  final isLoadingAppointments = false.obs;
  final isLoadingFreeSlots = false.obs;

  // Data
  final doctors = <MedicalProfessional>[].obs;
  // Private store for all doctors (before filtering)
  final _allDoctors = <MedicalProfessional>[];
  final schedulesForSelectedDoctor = <DoctorSchedule>[].obs;
  final branches = <BranchSettingModel>[].obs;

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
  int? _serviceId;

  // User-friendly error
  final errorMessage = RxnString();

  /// Initialize controller
  Future<void> init({
    int? serviceDurationInMinutes,
    int? serviceId,
    MedicalService? medicalService,
  }) async {
    _serviceDurationInMinutes = serviceDurationInMinutes;
    _serviceId = serviceId;

    // Prioritize service-specific data if available
    if (medicalService != null) {
      // Use service-specific branches and doctors (even if empty)
      branches.assignAll(medicalService.branches);
      _allDoctors.clear();
      _allDoctors.addAll(
        medicalService.medicalProfessionals.where((d) => d.isActive),
      );

      // Auto-select if only one branch
      if (branches.length == 1) {
        selectBranch(branches.first);
      }
    } else {
      // Fallback to global loading
      await loadBranches();
      await loadDoctors();

      // Auto-select branch AFTER both are loaded
      if (branches.length == 1 &&
          selectedBranch.value == null &&
          _allDoctors.isNotEmpty) {
        selectBranch(branches.first);
      }
    }
  }

  Future<void> loadBranches() async {
    isLoadingBranches.value = true;
    try {
      final list = await _branchSettingRepository.getBranchSettings();
      branches.assignAll(list);
    } catch (e) {
      errorMessage.value = 'Failed to load branches';
    } finally {
      isLoadingBranches.value = false;
    }
  }

  Future<void> loadDoctors() async {
    errorMessage.value = null;
    isLoadingDoctors.value = true;
    try {
      final list = await _doctorRepository.getDoctors();

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
        doctors.assignAll(_allDoctors);
      }
    } catch (e) {
      errorMessage.value = 'Failed to load doctors.';
      debugPrint('loadDoctors error: $e');
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
        // If doctor has no specific branches, assume available everywhere (or handle differently based on biz logic)
        // For safety, let's say they are available.
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

    // Load schedules to determine available dates
    await _loadSchedulesForDoctor(doctor.id);

    _recomputeAvailableDates();
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

    for (final schedule in schedules) {
      final scheduleStart = _dateOnly(schedule.startDate ?? start);
      final scheduleEnd = _dateOnly(schedule.endDate ?? end);

      final clampedStart = scheduleStart.isAfter(start) ? scheduleStart : start;
      final clampedEnd = scheduleEnd.isBefore(end) ? scheduleEnd : end;

      if (clampedStart.isAfter(clampedEnd)) continue;

      final targetDow = _parseDayOfWeek(schedule.dayOfWeek);

      for (
        var day = clampedStart;
        !day.isAfter(clampedEnd);
        day = day.add(const Duration(days: 1))
      ) {
        if (targetDow != null && day.weekday != targetDow) continue;
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

  Future<void> selectDate(DateTime date) async {
    final normalized = _dateOnly(date);
    selectedDate.value = normalized;
    selectedTime.value = null;

    await _fetchFreeSlotsForDate(normalized);
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
    availableDates.clear();
    availableTimes.clear();
    // Do not clear doctors/_allDoctors/branches if they were loaded once,
    // unless we want to force reload. But typical flow is to keep them.
    // However, if we want to ensure fresh start:
    // doctors.clear();
    // _allDoctors.clear();
    // branches.clear();
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
      debugPrint('_loadSchedulesForDoctor error: $e');
    } finally {
      isLoadingSchedules.value = false;
    }
  }

  Future<void> _fetchFreeSlotsForDate(DateTime date) async {
    availableTimes.clear();
    selectedTime.value = null;

    final doctor = selectedDoctor.value;
    final branch = selectedBranch.value;

    if (doctor == null || branch == null) return;

    isLoadingFreeSlots.value = true;
    errorMessage.value = null;

    try {
      final dateStr = date.toIso8601String().split('T').first; // yyyy-MM-dd
      final slots = await _doctorRepository.getFreeSlots(
        doctor.id,
        branch.id,
        dateStr,
      );

      final parsedSlots = <TimeOfDay>[];
      for (final slot in slots) {
        final t = parseTimeOfDay(slot);
        if (t != null) {
          parsedSlots.add(t);
        }
      }

      parsedSlots.sort(
        (a, b) => _timeToMinutes(a).compareTo(_timeToMinutes(b)),
      );

      availableTimes.assignAll(parsedSlots);

      // Auto-select first available time
      if (availableTimes.isNotEmpty) {
        selectedTime.value = availableTimes.first;
      }
    } catch (e) {
      errorMessage.value = 'Failed to load time slots.';
      debugPrint('_fetchFreeSlotsForDate error: $e');
    } finally {
      isLoadingFreeSlots.value = false;
    }
  }

  // -------------------------
  // Helpers (parsing + utils)
  // -------------------------

  DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  int _timeToMinutes(TimeOfDay t) => t.hour * 60 + t.minute;

  /// Parses dayOfWeek from various possible backend values:
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

  /// Public helper to parse TimeOfDay
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
}
