import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../config/app_routes.dart';

class AppointmentBookingView extends StatefulWidget {
  const AppointmentBookingView({super.key});

  @override
  State<AppointmentBookingView> createState() => _AppointmentBookingViewState();
}

class _AppointmentBookingViewState extends State<AppointmentBookingView> {
  final _formKey = GlobalKey<FormState>();
  late MedicalService service;

  // Selected values must come from the doctor schedule picker (not free pickers)
  String? selectedDoctorName;
  int? selectedDoctorId;
  DateTime? selectedDate;
  TimeOfDay? selectedTime;
  DateTime? selectedDateTime;

  @override
  void initState() {
    super.initState();
    service = Get.arguments as MedicalService;
  }

  Future<void> _openDoctorSchedulePicker() async {
    final result = await Get.toNamed(
      Routes.DOCTOR_SCHEDULE_PICKER,
      arguments: service,
    );

    if (result is Map) {
      setState(() {
        selectedDoctorId = result['doctorId'] as int?;
        selectedDoctorName = result['doctorName'] as String?;
        selectedDate = result['date'] as DateTime?;
        selectedTime = result['time'] as TimeOfDay?;
        selectedDateTime = result['dateTime'] as DateTime?;
      });
    }
  }

  void _submitBooking() {
    if (_formKey.currentState!.validate() &&
        selectedDoctorId != null &&
        selectedDate != null &&
        selectedTime != null &&
        selectedDateTime != null) {
      Get.snackbar(
        'Success',
        'Appointment Request Sent',
        backgroundColor: AppColors.successGreen,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
      // Wait for snackbar then go back
      Future.delayed(const Duration(seconds: 2), () {
        Get.offAllNamed('/dashboard'); // Go home after success
      });
    } else {
      Get.snackbar(
        'Required',
        'Please select doctor, date and time',
        backgroundColor: AppColors.warningOrange,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          // Header Section
          Container(
            height: 180,
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => Get.back(),
                              icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            ),
                            const SizedBox(width: 16),
                            Text(
                              'Select Schedule',
                              style: AppTextStyles.h2.copyWith(color: Colors.white),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'Service',
                          style: AppTextStyles.caption.copyWith(color: Colors.white70),
                        ),
                        Text(
                          service.name,
                          style: AppTextStyles.h3.copyWith(color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Form Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Doctor, Date & Time', style: AppTextStyles.h3),
                    const SizedBox(height: 8),
                    Text(
                      'Choose from the doctor’s available schedule',
                      style: AppTextStyles.bodySmall,
                    ),
                    const SizedBox(height: 24),

                    _buildSelectionCard(
                      title: 'Select Doctor & Slot',
                      value: (selectedDoctorName == null || selectedDateTime == null)
                          ? 'Choose Doctor, Date & Time'
                          : '${selectedDoctorName!} • ${DateFormat('EEE, d MMM').format(selectedDateTime!)} • ${DateFormat.jm().format(selectedDateTime!)}',
                      icon: Icons.event_available_rounded,
                      onTap: _openDoctorSchedulePicker,
                      isSelected: selectedDoctorId != null && selectedDateTime != null,
                    ),

                    const SizedBox(height: 40),

                    // Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _submitBooking,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          elevation: 8,
                          shadowColor: AppColors.primaryBlue.withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text('Confirm Booking', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSelectionCard({
    required String title,
    required String value,
    required IconData icon,
    required VoidCallback onTap,
    required bool isSelected,
  }) {
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
                    color: isSelected ? AppColors.primaryBlue.withOpacity(0.1) : AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: isSelected ? AppColors.primaryBlue : AppColors.textSecondary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: AppTextStyles.caption,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        value,
                        style: AppTextStyles.bodyMedium.copyWith(
                          fontWeight: FontWeight.w600,
                          color: isSelected ? AppColors.textPrimary : AppColors.textHint,
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
                  color: isSelected ? AppColors.primaryBlue : AppColors.textHint,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
