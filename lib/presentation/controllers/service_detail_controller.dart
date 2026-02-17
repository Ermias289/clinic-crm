import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../../domain/models/medical_service_model.dart';
import '../../domain/models/medical_professional_model.dart';
import '../../data/repositories/doctor_repository_impl.dart';
import '../../domain/repositories/branch_setting_repository.dart';
import '../../data/models/branch_setting_model.dart';
import '../../config/app_routes.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/image_utils.dart';

class ServiceDetailController extends GetxController {
  final DoctorRepository _doctorRepository;
  final BranchSettingRepository _branchSettingRepository;

  ServiceDetailController(
    this._doctorRepository,
    this._branchSettingRepository,
  );

  // Service passed from previous screen
  late MedicalService service;

  // Doctors data
  final doctors = <MedicalProfessional>[].obs;
  final isLoadingDoctors = false.obs;
  final errorMessage = Rxn<String>();

  // Branches data
  final branches = <BranchSettingModel>[].obs;
  final isLoadingBranches = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Get service from arguments
    service = Get.arguments as MedicalService;
    loadDoctors();
    loadBranches();
  }

  Future<void> loadBranches() async {
    try {
      isLoadingBranches.value = true;
      
      // Prioritize branches already embedded in the service object
      if (service.branches != null) {
        branches.assignAll(service.branches!);
        return;
      }

      final allBranches = await _branchSettingRepository.getBranchSettings();
      branches.value = allBranches;
    } catch (e) {
      // Silently handle branch loading error
    } finally {
      isLoadingBranches.value = false;
    }
  }

  Future<void> loadDoctors() async {
    try {
      isLoadingDoctors.value = true;
      errorMessage.value = null;

      // Prioritize doctors already embedded in the service object
      if (service.medicalProfessionals != null) {
        final activeDoctors = service.medicalProfessionals!
            .where((doctor) => doctor.isActive)
            .toList();
        doctors.assignAll(activeDoctors);
        return;
      }

      final allDoctors = await _doctorRepository.getDoctors();

      // Filter active doctors only
      doctors.value = allDoctors.where((doctor) => doctor.isActive).toList();
    } catch (e) {
      errorMessage.value = 'Failed to load doctors: ${e.toString()}';
    } finally {
      isLoadingDoctors.value = false;
    }
  }

  void retryLoadingDoctors() {
    loadDoctors();
  }

  void onDoctorSelected(MedicalProfessional doctor) {
    // Show doctor details dialog
    showDoctorDetails(doctor);
  }

  void onBranchSelected(BranchSettingModel branch) {
    // Show branch details dialog
    showBranchDetails(branch);
  }

  void onBookAppointment() {
    // Navigate to appointment booking with service only
    // User can select doctor in the booking flow
    Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
  }

  void showBranchDetails(BranchSettingModel branch) {
    Get.dialog(
      Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: Colors.white,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.location_city,
                      color: AppColors.primaryBlue,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          branch.name ?? 'Unknown Branch',
                          style: Get.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Branch Details',
                          style: Get.textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Get.back(),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Branch Information
              if (branch.address?.isNotEmpty == true) ...[
                _buildDetailRow(Icons.location_on, 'Address', branch.address!),
                const SizedBox(height: 16),
              ],

              if (branch.phoneNumber?.isNotEmpty == true) ...[
                _buildDetailRow(Icons.phone, 'Phone', branch.phoneNumber!),
                const SizedBox(height: 16),
              ],

              if (branch.city?.isNotEmpty == true) ...[
                _buildDetailRow(Icons.location_city, 'City', branch.city!),
                const SizedBox(height: 16),
              ],

              if (branch.subCity?.isNotEmpty == true) ...[
                _buildDetailRow(
                  Icons.location_on_outlined,
                  'Sub City',
                  branch.subCity!,
                ),
                const SizedBox(height: 16),
              ],

              if (branch.location?.isNotEmpty == true) ...[
                _buildDetailRow(Icons.place, 'Location', branch.location!),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void showDoctorDetails(MedicalProfessional doctor) {
    Get.dialog(
      Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: Colors.white,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with Doctor Avatar
              Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                    ),
                    child: ClipOval(
                      child: doctor.profilePictureUrl?.isNotEmpty == true
                          ? Image.network(
                              ImageUtils.buildImageUrl(
                                doctor.profilePictureUrl!,
                              ),
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Icon(
                                    Icons.person,
                                    size: 30,
                                    color: AppColors.primaryBlue,
                                  ),
                            )
                          : Icon(
                              Icons.person,
                              size: 30,
                              color: AppColors.primaryBlue,
                            ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          doctor.fullName,
                          style: Get.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (doctor.jobTitle?.isNotEmpty == true)
                          Text(
                            doctor.jobTitle!,
                            style: Get.textTheme.bodyMedium?.copyWith(
                              color: AppColors.primaryBlue,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Get.back(),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Doctor Information
              if (doctor.specialization?.isNotEmpty == true) ...[
                _buildDetailRow(
                  Icons.medical_services,
                  'Specialization',
                  doctor.specialization!,
                ),
                const SizedBox(height: 16),
              ],

              if (doctor.educationalBackground?.isNotEmpty == true) ...[
                _buildDetailRow(
                  Icons.school,
                  'Education',
                  doctor.educationalBackground!,
                ),
                const SizedBox(height: 16),
              ],

              if (doctor.yearsOfExperience != null &&
                  doctor.yearsOfExperience! > 0) ...[
                _buildDetailRow(
                  Icons.work,
                  'Experience',
                  '${doctor.yearsOfExperience} years',
                ),
                const SizedBox(height: 16),
              ],

              // Branches where doctor works
              if (doctor.branches?.isNotEmpty == true) ...[
                const SizedBox(height: 8),
                Text(
                  'Available at Branches:',
                  style: Get.textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                ...doctor.branches!.map(
                  (branch) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            branch.name ?? 'Unknown Branch',
                            style: Get.textTheme.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
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
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Get.textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: Get.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
