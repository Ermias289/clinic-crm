import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/appointment_detail_controller.dart';

class AppointmentDetailView extends GetView<AppointmentDetailController> {
  const AppointmentDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar text color to black
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildStatusSection(),
                    const SizedBox(height: 24),
                    _buildDetailsSection(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: Builder(
        builder: (context) {
          final rawStatus = controller.appointment.status;
          final status = (rawStatus ?? '').trim().toLowerCase();
          
          // Check for various completion/cancellation states
          final isCompleted = status == 'completed';
          final isCancelled = status == 'cancelled' || status == 'canceled';
          final canCancel = !isCompleted && !isCancelled && status.isNotEmpty;
          
          if (!canCancel) return const SizedBox.shrink();

          return Obx(() => FloatingActionButton.extended(
            onPressed: controller.isLoading.value ? null : () => _showCancelDialog(context),
            backgroundColor: Colors.redAccent,
            icon: controller.isLoading.value 
              ? const SizedBox(
                  width: 20, 
                  height: 20, 
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                )
              : const Icon(Icons.cancel_outlined, color: Colors.white),
            label: Text(
              controller.isLoading.value ? 'Processing...' : 'Cancel Appointment',
              style: AppTextStyles.bodyMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ));
        }
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildHeader() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(24),
        boxShadow: AppColors.cardShadow,
      ),
      padding: const EdgeInsets.all(24),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Get.back(),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.arrow_back, color: Colors.white),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Appointment Details',
                  style: AppTextStyles.h2.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  'Reference: ${controller.appointment.reference ?? 'N/A'}',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusSection() {
    final rawStatus = controller.appointment.status;
    final status = (rawStatus ?? 'Scheduled').trim();
    final statusLower = status.toLowerCase();
    
    final isCompleted = statusLower == 'completed';
    final isCancelled = statusLower == 'cancelled' || statusLower == 'canceled';
    
    Color statusColor = AppColors.primaryBlue;
    IconData statusIcon = Icons.calendar_today;
    
    if (isCompleted) {
      statusColor = Colors.green;
      statusIcon = Icons.check_circle;
    } else if (isCancelled) {
      statusColor = Colors.red;
      statusIcon = Icons.cancel;
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: statusColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: statusColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(statusIcon, color: statusColor, size: 48),
          const SizedBox(height: 12),
          Text(
            status.toUpperCase(),
            style: AppTextStyles.h3.copyWith(color: statusColor),
          ),
          const SizedBox(height: 8),
          Text(
            isCompleted 
                ? 'This appointment has been completed.' 
                : isCancelled 
                    ? 'This appointment has been cancelled.' 
                    : 'This appointment is scheduled.',
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMedium.copyWith(
              color: statusColor.withValues(alpha: 0.8),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailsSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Information',
            style: AppTextStyles.h3.copyWith(color: AppColors.textPrimary),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Service', controller.appointment.dentistryService?.name ?? 'N/A'),
          if (controller.appointment.dentistryService?.durationInMinutes != null)
             _buildInfoRow('Duration', '${controller.appointment.dentistryService!.durationInMinutes} mins'),
          
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 16),
          
          _buildInfoRow('Data', controller.appointment.day),
          _buildInfoRow('Time', controller.appointment.reservationTime),
          
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 16),
          
          _buildInfoRow('Doctor', '${controller.appointment.medicalProfessional?.fName ?? ''} ${controller.appointment.medicalProfessional?.lName ?? ''}'),
          if (controller.appointment.medicalProfessional?.specialty.isNotEmpty == true)
            _buildInfoRow('Specialty', controller.appointment.medicalProfessional!.specialty),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showCancelDialog(BuildContext context) {
    final reasonController = TextEditingController();
    
    Get.dialog(
      AlertDialog(
        title: Text('Cancel Appointment', style: AppTextStyles.h3),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Are you sure you want to cancel this appointment? Please provide a reason.',
              style: AppTextStyles.bodyMedium,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                hintText: 'Reason for cancellation',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('Keep', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              if (reasonController.text.trim().isEmpty) {
                Get.snackbar('Required', 'Please enter a reason', snackPosition: SnackPosition.BOTTOM);
                return;
              }
              Get.back(); // Close dialog
              controller.cancelAppointment(reasonController.text);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            child: Text('Cancel Appointment', style: AppTextStyles.bodyMedium.copyWith(color: Colors.white)),
          ),
        ],
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
