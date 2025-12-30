import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/utils/image_utils.dart';
import '../../domain/models/medical_service_model.dart';
import '../controllers/doctor_schedule_picker_controller.dart';

/// Flow: Service (already chosen) -> Doctor -> Date -> Time (from schedule only)
///
/// Navigation:
/// - Expects `Get.arguments` to contain the selected `MedicalService`.
/// - On continue, returns a map result via `Get.back(result: ...)` so the caller
///   can proceed to confirmation / submission.
///
/// Result payload:
/// {
///   "service": MedicalService,
///   "doctorId": int,
///   "doctorName": String,
///   "date": DateTime (date-only),
///   "time": TimeOfDay,
///   "dateTime": DateTime (combined),
/// }
class DoctorSchedulePickerView extends StatefulWidget {
  const DoctorSchedulePickerView({super.key});

  @override
  State<DoctorSchedulePickerView> createState() =>
      _DoctorSchedulePickerViewState();
}

class _DoctorSchedulePickerViewState extends State<DoctorSchedulePickerView> {
  late final MedicalService _service;
  late final DoctorSchedulePickerController _controller;

  @override
  void initState() {
    super.initState();

    final args = Get.arguments;
    _service = args as MedicalService;

    _controller = Get.find<DoctorSchedulePickerController>();
    // Ensure fresh state each time this page is opened
    _controller.resetAll();
    _controller.init(serviceDurationInMinutes: _service.durationInMinutes);
  }

  @override
  void dispose() {
    // Keep controller in DI, but reset UI state to avoid stale selections if user returns.
    _controller.resetAll();
    super.dispose();
  }

  void _continue() {
    if (!_controller.canContinue) {
      Get.snackbar(
        'Required',
        'Please select doctor, date, and time',
        backgroundColor: AppColors.warningOrange,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
      return;
    }

    final doctor = _controller.selectedDoctor.value!;
    final date = _controller.selectedDate.value!;
    final time = _controller.selectedTime.value!;
    final dateTime = _controller.selectedDateTime!;

    Get.back(
      result: {
        'service': _service,
        'doctorId': doctor.id,
        'doctorName': doctor.fullName,
        'date': date,
        'time': time,
        'dateTime': dateTime,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          _Header(serviceName: _service.name),
          Expanded(
            child: Obx(() {
              final error = _controller.errorMessage.value;

              return SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (error != null) ...[
                      _ErrorBanner(message: error),
                      const SizedBox(height: 16),
                    ],

                    Text('Doctor', style: AppTextStyles.h3),
                    const SizedBox(height: 8),
                    Text(
                      'Choose your preferred doctor',
                      style: AppTextStyles.bodySmall,
                    ),
                    const SizedBox(height: 16),

                    _buildDoctorSection(),

                    const SizedBox(height: 28),

                    Text('Date', style: AppTextStyles.h3),
                    const SizedBox(height: 8),
                    Text(
                      'Available dates are based on the selected doctor’s schedule',
                      style: AppTextStyles.bodySmall,
                    ),
                    const SizedBox(height: 16),

                    _buildDateSection(),

                    const SizedBox(height: 28),

                    Text('Time', style: AppTextStyles.h3),
                    const SizedBox(height: 8),
                    Text(
                      'Only available time slots are shown',
                      style: AppTextStyles.bodySmall,
                    ),
                    const SizedBox(height: 16),

                    _buildTimeSection(),

                    const SizedBox(height: 40),

                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _controller.canContinue ? _continue : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: AppColors.primaryBlue
                              .withOpacity(0.4),
                          disabledForegroundColor: Colors.white.withOpacity(
                            0.9,
                          ),
                          elevation: 8,
                          shadowColor: AppColors.primaryBlue.withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text(
                          'Continue',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorSection() {
    return Obx(() {
      if (_controller.isLoadingDoctors.value) {
        return _LoadingCard(label: 'Loading doctors...');
      }

      if (_controller.doctors.isEmpty) {
        return _EmptyStateCard(
          title: 'No doctors found',
          subtitle: 'Please try again later.',
          icon: Icons.medical_information_rounded,
          actionLabel: 'Refresh',
          onAction: _controller.loadDoctors,
        );
      }

      return _SelectionCard(
        title: 'Select Doctor',
        value: _controller.selectedDoctor.value?.fullName ?? 'Choose Doctor',
        icon: Icons.person_rounded,
        isSelected: _controller.selectedDoctor.value != null,
        onTap: () => _openDoctorBottomSheet(),
      );
    });
  }

  void _openDoctorBottomSheet() {
    Get.bottomSheet(
      Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 42,
                height: 5,
                decoration: BoxDecoration(
                  color: AppColors.textHint.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Text('Choose Doctor', style: AppTextStyles.h3),
                    const Spacer(),
                    IconButton(
                      onPressed: () => Get.back(),
                      icon: const Icon(Icons.close_rounded),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.65,
                ),
                child: Obx(() {
                  final list = _controller.doctors;

                  return GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.85,
                        ),
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      final doctor = list[index];
                      final selected =
                          _controller.selectedDoctor.value?.id == doctor.id;

                      return InkWell(
                        onTap: () async {
                          await _controller.selectDoctor(doctor);
                          Get.back();
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          decoration: BoxDecoration(
                            color: selected
                                ? AppColors.primaryBlue.withOpacity(0.08)
                                : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: selected
                                  ? AppColors.primaryBlue
                                  : AppColors.textHint.withOpacity(0.15),
                              width: 1.5,
                            ),
                            boxShadow: AppColors.softShadow,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              const SizedBox(height: 16),
                              // Profile Image
                              Stack(
                                children: [
                                  Container(
                                    width: 70,
                                    height: 70,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: selected
                                            ? AppColors.primaryBlue
                                            : AppColors.textHint.withOpacity(
                                                0.2,
                                              ),
                                        width: 2,
                                      ),
                                    ),
                                    child: ClipOval(
                                      child:
                                          doctor.profilePictureUrl != null &&
                                              doctor
                                                  .profilePictureUrl!
                                                  .isNotEmpty
                                          ? Image.network(
                                              ImageUtils.buildImageUrl(
                                                doctor.profilePictureUrl!,
                                              ),
                                              width: 70,
                                              height: 70,
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) =>
                                                  Container(
                                                    color: AppColors.primaryBlue
                                                        .withOpacity(0.1),
                                                    child: Icon(
                                                      Icons.person_rounded,
                                                      color:
                                                          AppColors.primaryBlue,
                                                      size: 35,
                                                    ),
                                                  ),
                                            )
                                          : Container(
                                              color: AppColors.primaryBlue
                                                  .withOpacity(0.1),
                                              child: Icon(
                                                Icons.person_rounded,
                                                color: AppColors.primaryBlue,
                                                size: 35,
                                              ),
                                            ),
                                    ),
                                  ),
                                  if (selected)
                                    Positioned(
                                      right: 0,
                                      bottom: 0,
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: BoxDecoration(
                                          color: AppColors.primaryBlue,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: Colors.white,
                                            width: 2,
                                          ),
                                        ),
                                        child: const Icon(
                                          Icons.check,
                                          color: Colors.white,
                                          size: 12,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              // Doctor Name
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                ),
                                child: Text(
                                  doctor.fullName,
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(height: 4),
                              // Specialization
                              if (doctor.specialization != null &&
                                  doctor.specialization!.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                  ),
                                  child: Text(
                                    doctor.specialization!,
                                    style: AppTextStyles.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 11,
                                    ),
                                    textAlign: TextAlign.center,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              const Spacer(),
                              // Selection Indicator
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: selected
                                      ? AppColors.primaryBlue.withOpacity(0.1)
                                      : Colors.transparent,
                                  borderRadius: const BorderRadius.only(
                                    bottomLeft: Radius.circular(16),
                                    bottomRight: Radius.circular(16),
                                  ),
                                ),
                                child: Icon(
                                  selected
                                      ? Icons.check_circle
                                      : Icons.radio_button_unchecked,
                                  color: selected
                                      ? AppColors.primaryBlue
                                      : AppColors.textHint,
                                  size: 20,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      isScrollControlled: true,
    );
  }

  Widget _buildDateSection() {
    return Obx(() {
      final doctor = _controller.selectedDoctor.value;
      if (doctor == null) {
        return _DisabledHintCard(
          icon: Icons.calendar_today_rounded,
          title: 'Select a doctor first',
          subtitle: 'Dates will appear after you pick a doctor.',
        );
      }

      if (_controller.isLoadingSchedules.value) {
        return _LoadingCard(label: 'Loading schedule...');
      }

      if (_controller.availableDates.isEmpty) {
        return _EmptyStateCard(
          title: 'No available dates',
          subtitle: 'This doctor has no schedule configured.',
          icon: Icons.event_busy_rounded,
          actionLabel: 'Pick another doctor',
          onAction: () => _openDoctorBottomSheet(),
        );
      }

      final selected = _controller.selectedDate.value;

      final label = selected != null
          ? DateFormat('EEE, d MMM yyyy').format(selected)
          : 'Choose Date';

      return _SelectionCard(
        title: 'Select Date',
        value: label,
        icon: Icons.calendar_today_rounded,
        isSelected: selected != null,
        onTap: () => _openDateBottomSheet(),
      );
    });
  }

  void _openDateBottomSheet() {
    Get.bottomSheet(
      Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 42,
                height: 5,
                decoration: BoxDecoration(
                  color: AppColors.textHint.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Text('Choose Date', style: AppTextStyles.h3),
                    const Spacer(),
                    IconButton(
                      onPressed: () => Get.back(),
                      icon: const Icon(Icons.close_rounded),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.5,
                ),
                child: Obx(() {
                  final dates = _controller.availableDates;
                  final selected = _controller.selectedDate.value;

                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: dates.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final d = dates[index];
                      final isSelected =
                          selected != null && _isSameDate(d, selected);

                      return InkWell(
                        onTap: () {
                          _controller.selectDate(d);
                          Get.back();
                        },
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primaryBlue.withOpacity(0.08)
                                : Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primaryBlue
                                  : AppColors.textHint.withOpacity(0.15),
                              width: 1.2,
                            ),
                            boxShadow: AppColors.softShadow,
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.calendar_today_rounded,
                                color: isSelected
                                    ? AppColors.primaryBlue
                                    : AppColors.textSecondary,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  DateFormat('EEEE, d MMM yyyy').format(d),
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                isSelected
                                    ? Icons.check_circle_rounded
                                    : Icons.radio_button_unchecked_rounded,
                                color: isSelected
                                    ? AppColors.primaryBlue
                                    : AppColors.textHint,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      isScrollControlled: true,
    );
  }

  Widget _buildTimeSection() {
    return Obx(() {
      final doctor = _controller.selectedDoctor.value;
      if (doctor == null) {
        return _DisabledHintCard(
          icon: Icons.access_time_rounded,
          title: 'Select a doctor first',
          subtitle: 'Time slots will appear after you pick a doctor.',
        );
      }

      final date = _controller.selectedDate.value;
      if (date == null) {
        return _DisabledHintCard(
          icon: Icons.access_time_rounded,
          title: 'Select a date',
          subtitle: 'Choose a date to see available times.',
        );
      }

      if (_controller.isLoadingSchedules.value) {
        return _LoadingCard(label: 'Loading schedule...');
      }

      if (_controller.availableTimes.isEmpty) {
        return _EmptyStateCard(
          title: 'No available times',
          subtitle: 'Try a different date or doctor.',
          icon: Icons.schedule_rounded,
          actionLabel: 'Change date',
          onAction: () {
            // Scroll user back to date section by doing nothing; date pills are above.
            // They can choose another date.
          },
        );
      }

      final selected = _controller.selectedTime.value;

      final label = selected != null
          ? _formatTime(context, selected)
          : 'Choose Time';

      return _SelectionCard(
        title: 'Select Time',
        value: label,
        icon: Icons.access_time_rounded,
        isSelected: selected != null,
        onTap: () => _openTimeBottomSheet(),
      );
    });
  }

  void _openTimeBottomSheet() {
    Get.bottomSheet(
      Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 42,
                height: 5,
                decoration: BoxDecoration(
                  color: AppColors.textHint.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Text('Choose Time', style: AppTextStyles.h3),
                    const Spacer(),
                    IconButton(
                      onPressed: () => Get.back(),
                      icon: const Icon(Icons.close_rounded),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.5,
                ),
                child: Obx(() {
                  final times = _controller.availableTimes;
                  final selected = _controller.selectedTime.value;

                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: times.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final t = times[index];
                      final isSelected =
                          selected != null && _isSameTime(t, selected);

                      return InkWell(
                        onTap: () {
                          _controller.selectTime(t);
                          Get.back();
                        },
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primaryBlue.withOpacity(0.08)
                                : Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primaryBlue
                                  : AppColors.textHint.withOpacity(0.15),
                              width: 1.2,
                            ),
                            boxShadow: AppColors.softShadow,
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.access_time_rounded,
                                color: AppColors.textSecondary,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  _formatTime(context, t),
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                isSelected
                                    ? Icons.check_circle_rounded
                                    : Icons.radio_button_unchecked_rounded,
                                color: isSelected
                                    ? AppColors.primaryBlue
                                    : AppColors.textHint,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                }),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
      isScrollControlled: true,
    );
  }

  bool _isSameDate(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  bool _isSameTime(TimeOfDay a, TimeOfDay b) =>
      a.hour == b.hour && a.minute == b.minute;

  String _formatTime(BuildContext context, TimeOfDay t) {
    final dt = DateTime(2025, 1, 1, t.hour, t.minute);
    return DateFormat.jm().format(dt);
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.serviceName});

  final String serviceName;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 190,
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: SafeArea(
        child: Stack(
          children: [
            Positioned(
              right: -20,
              top: -20,
              child: CircleAvatar(
                radius: 60,
                backgroundColor: Colors.white.withOpacity(0.1),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: SingleChildScrollView(
                physics: const NeverScrollableScrollPhysics(),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => Get.back(),
                          icon: const Icon(
                            Icons.arrow_back_ios,
                            color: Colors.white,
                            size: 20,
                          ),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                        const SizedBox(width: 16),
                        Text(
                          'Choose Doctor',
                          style: AppTextStyles.h2.copyWith(color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Service',
                      style: AppTextStyles.caption.copyWith(
                        color: Colors.white70,
                      ),
                    ),
                    Text(
                      serviceName,
                      style: AppTextStyles.h3.copyWith(color: Colors.white),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Select doctor, date, and time from schedule',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SelectionCard extends StatelessWidget {
  const _SelectionCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.onTap,
    required this.isSelected,
  });

  final String title;
  final String value;
  final IconData icon;
  final VoidCallback onTap;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
        border: Border.all(
          color: isSelected ? AppColors.primaryBlue : Colors.transparent,
          width: 1.5,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryBlue.withOpacity(0.1)
                        : AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: isSelected
                        ? AppColors.primaryBlue
                        : AppColors.textSecondary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: AppTextStyles.caption),
                      const SizedBox(height: 4),
                      Text(
                        value,
                        style: AppTextStyles.bodyMedium.copyWith(
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? AppColors.textPrimary
                              : AppColors.textHint,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16,
                  color: isSelected
                      ? AppColors.primaryBlue
                      : AppColors.textHint,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DisabledHintCard extends StatelessWidget {
  const _DisabledHintCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
        border: Border.all(color: AppColors.textHint.withOpacity(0.15)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.backgroundLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.textHint),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle, style: AppTextStyles.bodySmall),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LoadingCard extends StatelessWidget {
  const _LoadingCard({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
        border: Border.all(color: AppColors.textHint.withOpacity(0.15)),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(strokeWidth: 2.5),
          ),
          const SizedBox(width: 12),
          Text(label, style: AppTextStyles.bodyMedium),
        ],
      ),
    );
  }
}

class _EmptyStateCard extends StatelessWidget {
  const _EmptyStateCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.actionLabel,
    required this.onAction,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final String actionLabel;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
        border: Border.all(color: AppColors.textHint.withOpacity(0.15)),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.warningOrange.withOpacity(0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.warningOrange),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(subtitle, style: AppTextStyles.bodySmall),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton(
                    onPressed: onAction,
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.primaryBlue,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      actionLabel,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.warningOrange.withOpacity(0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.warningOrange.withOpacity(0.35)),
      ),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          const Icon(
            Icons.error_outline_rounded,
            color: AppColors.warningOrange,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
