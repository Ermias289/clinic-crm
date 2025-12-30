import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:intl/intl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../config/app_routes.dart';
import '../../core/api_client.dart';

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

  Future<void> _submitBooking() async {
    if (_formKey.currentState!.validate() &&
        selectedDoctorId != null &&
        selectedDate != null &&
        selectedTime != null &&
        selectedDateTime != null) {
      // Show confirmation dialog
      final confirmed = await _showConfirmationDialog();

      if (confirmed == true) {
        await _bookAppointment();
      }
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

  Future<bool?> _showConfirmationDialog() {
    return Get.dialog<bool>(
      Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.calendar_month_rounded,
                  color: AppColors.primaryBlue,
                  size: 48,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Confirm Appointment',
                style: AppTextStyles.h2.copyWith(fontSize: 22),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Please review your appointment details',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    _buildDetailRow(
                      Icons.medical_services,
                      'Service',
                      service.name,
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.person,
                      'Doctor',
                      selectedDoctorName ?? 'N/A',
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.calendar_today,
                      'Date',
                      DateFormat('EEEE, d MMM yyyy').format(selectedDate!),
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.access_time,
                      'Time',
                      DateFormat.jm().format(selectedDateTime!),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Get.back(result: false),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: AppColors.textHint),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Get.back(result: true),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: AppColors.primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Proceed',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      barrierDismissible: false,
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.primaryBlue),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTextStyles.caption),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _bookAppointment() async {
    try {
      // Show loading
      Get.dialog(
        const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        ),
        barrierDismissible: false,
      );

      final apiClient = Get.find<ApiClient>();

      // Get patient ID from storage
      final box = GetStorage();
      final patientId = box.read('userId') ?? 0;

      // Format date and time for API
      final dateOnly = DateFormat('yyyy-MM-dd').format(selectedDate!);
      final timeOnly = DateFormat('H:mm').format(selectedDateTime!);

      final response = await apiClient.post('/Appointment', {
        'dentistryId': service.id,
        'medicalProfessionalId': selectedDoctorId,
        'patientId': patientId, // Added missing patient ID
        'day': dateOnly,
        'reservationTime': timeOnly,
      });

      // Close loading dialog
      Get.back();

      if (response.hasError) {
        // Handle specific error messages
        String errorMessage =
            response.statusText ?? 'Failed to book appointment';

        if (response.body is Map && response.body['message'] != null) {
          final backendMessage = response.body['message'] as String;

          if (backendMessage.contains('card will expire')) {
            errorMessage =
                'Your card needs to be activated before booking appointments. Please contact support or wait for card approval.';
          } else {
            errorMessage = backendMessage;
          }
        }

        throw Exception(errorMessage);
      }

      // Show success message
      Get.snackbar(
        'Success',
        'Appointment booked successfully!',
        backgroundColor: AppColors.successGreen,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 3),
      );

      // Navigate back to dashboard
      Get.until((route) => route.isFirst);
    } catch (e) {
      // Close loading dialog if still open
      if (Get.isDialogOpen ?? false) {
        Get.back();
      }

      Get.snackbar(
        'Error',
        'Failed to book appointment: ${e.toString()}',
        backgroundColor: AppColors.warningOrange,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 4),
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 10,
                    ),
                    child: Column(
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
                              'Select Schedule',
                              style: AppTextStyles.h2.copyWith(
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'Service',
                          style: AppTextStyles.caption.copyWith(
                            color: Colors.white70,
                          ),
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
                      value:
                          (selectedDoctorName == null ||
                              selectedDateTime == null)
                          ? 'Choose Doctor, Date & Time'
                          : '${selectedDoctorName!} • ${DateFormat('EEE, d MMM').format(selectedDateTime!)} • ${DateFormat.jm().format(selectedDateTime!)}',
                      icon: Icons.event_available_rounded,
                      onTap: _openDoctorSchedulePicker,
                      isSelected:
                          selectedDoctorId != null && selectedDateTime != null,
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
                        child: const Text(
                          'Book Appointment',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
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
