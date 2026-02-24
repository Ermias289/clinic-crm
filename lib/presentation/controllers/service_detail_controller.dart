import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../domain/models/medical_service_model.dart';
import '../../data/models/branch_setting_model.dart';
import '../../config/app_routes.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/utils/image_utils.dart';

class ServiceDetailController extends GetxController {
  // Service passed from previous screen
  late MedicalService service;

  // Doctors and branches from the service
  final doctors = <MedicalProfessional>[].obs;
  final branches = <BranchSettingModel>[].obs;
  final isLoadingData = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Get service from arguments
    service = Get.arguments as MedicalService;
    loadServiceData();
  }

  void loadServiceData() {
    try {
      isLoadingData.value = true;

      // Use doctors and branches from the service itself
      if (service.medicalProfessionals != null) {
        // Filter only active doctors
        doctors.value = service.medicalProfessionals!
            .where((doctor) => doctor.isActive)
            .toList();
      }

      if (service.branches != null) {
        branches.value = service.branches!;
      }
    } finally {
      isLoadingData.value = false;
    }
  }

  void onDoctorSelected(MedicalProfessional doctor) {
    // Show doctor details popup instead of navigating
    Get.dialog(_buildDoctorDetailsDialog(doctor), barrierDismissible: true);
  }

  void onBranchSelected(BranchSettingModel branch) {
    // Show branch details popup
    Get.dialog(_buildBranchDetailsDialog(branch), barrierDismissible: true);
  }

  Widget _buildDoctorDetailsDialog(MedicalProfessional doctor) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Doctor Avatar
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.backgroundLight,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipOval(
                  child: doctor.profilePicture?.isNotEmpty == true
                      ? Image.network(
                          ImageUtils.buildImageUrl(doctor.profilePicture!),
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              _buildDoctorAvatarIcon(),
                        )
                      : _buildDoctorAvatarIcon(),
                ),
              ),
              const SizedBox(height: 16),

              // Doctor Name
              Text(
                doctor.fullName,
                style: AppTextStyles.h2.copyWith(color: AppColors.textPrimary),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 8),

              // Job Title
              if (doctor.jobTitle?.isNotEmpty == true)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    doctor.jobTitle!,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.primaryBlue,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),

              const SizedBox(height: 20),

              // Details Section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    // Specialization
                    if (doctor.specialty?.isNotEmpty == true)
                      _buildDetailRow(
                        Icons.medical_services,
                        'Specialization',
                        doctor.specialty!,
                      ),

                    // Educational Background
                    if (doctor.educationalBackground?.isNotEmpty == true) ...[
                      if (doctor.specialty?.isNotEmpty == true)
                        const Divider(height: 24),
                      _buildDetailRow(
                        Icons.school,
                        'Education',
                        doctor.educationalBackground!,
                      ),
                    ],

                    // Years of Experience
                    if (doctor.yearsOfExperience != null &&
                        doctor.yearsOfExperience! > 0) ...[
                      if (doctor.specialty?.isNotEmpty == true ||
                          doctor.educationalBackground?.isNotEmpty == true)
                        const Divider(height: 24),
                      _buildDetailRow(
                        Icons.work_outline,
                        'Experience',
                        '${doctor.yearsOfExperience} years',
                      ),
                    ],

                    // License Number
                    if (doctor.licenseNumber?.isNotEmpty == true) ...[
                      if (doctor.specialty?.isNotEmpty == true ||
                          doctor.educationalBackground?.isNotEmpty == true ||
                          (doctor.yearsOfExperience != null &&
                              doctor.yearsOfExperience! > 0))
                        const Divider(height: 24),
                      _buildDetailRow(
                        Icons.badge,
                        'License',
                        doctor.licenseNumber!,
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Close Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Get.back(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Close',
                    style: AppTextStyles.button.copyWith(color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBranchDetailsDialog(BranchSettingModel branch) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Branch Icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.business,
                  size: 40,
                  color: AppColors.primaryBlue,
                ),
              ),
              const SizedBox(height: 16),

              // Branch Name
              Text(
                branch.name ?? 'Branch ${branch.id}',
                style: AppTextStyles.h2.copyWith(color: AppColors.textPrimary),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 20),

              // Details Section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    // Address
                    if (branch.address?.isNotEmpty == true)
                      _buildDetailRow(
                        Icons.location_on,
                        'Address',
                        branch.address!,
                      ),

                    // City
                    if (branch.city?.isNotEmpty == true) ...[
                      if (branch.address?.isNotEmpty == true)
                        const Divider(height: 24),
                      _buildDetailRow(
                        Icons.location_city,
                        'City',
                        branch.city!,
                      ),
                    ],

                    // Sub City
                    if (branch.subCity?.isNotEmpty == true) ...[
                      if (branch.address?.isNotEmpty == true ||
                          branch.city?.isNotEmpty == true)
                        const Divider(height: 24),
                      _buildDetailRow(Icons.map, 'Sub City', branch.subCity!),
                    ],

                    // Location
                    if (branch.location?.isNotEmpty == true) ...[
                      if (branch.address?.isNotEmpty == true ||
                          branch.city?.isNotEmpty == true ||
                          branch.subCity?.isNotEmpty == true)
                        const Divider(height: 24),
                      _buildDetailRow(
                        Icons.place,
                        'Location',
                        branch.location!,
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Close Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Get.back(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Close',
                    style: AppTextStyles.button.copyWith(color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.primaryBlue),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDoctorAvatarIcon() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryBlue.withValues(alpha: 0.1),
            AppColors.accentTeal.withValues(alpha: 0.1),
          ],
        ),
      ),
      child: const Icon(Icons.person, size: 50, color: AppColors.primaryBlue),
    );
  }

  void onBookAppointment() {
    // Navigate to appointment booking with service
    Get.toNamed(Routes.bookAppointment, arguments: service);
  }
}
