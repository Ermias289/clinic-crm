import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/utils/image_utils.dart';
import '../../domain/models/medical_professional_model.dart';
import '../controllers/service_detail_controller.dart';
import '../widgets/custom_button.dart';

class ServiceDetailView extends StatelessWidget {
  const ServiceDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
    });
    return GetBuilder<ServiceDetailController>(
      builder: (controller) => Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: Column(
          children: [
            // Header Section with Service Image
            _buildHeader(controller),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Service Image and Name
                    Center(
                      child: Column(
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: AppColors.cardShadow,
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(20),
                              child:
                                  controller.service.servicePicture.isNotEmpty
                                  ? Image.network(
                                      ImageUtils.buildImageUrl(
                                        controller.service.servicePicture,
                                      ),
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) =>
                                              _buildServiceIcon(),
                                    )
                                  : _buildServiceIcon(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            controller.service.name,
                            style: AppTextStyles.h2.copyWith(
                              color: AppColors.textPrimary,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Service Info Card
                    _buildServiceInfoCard(controller),

                    const SizedBox(height: 24),

                    // Doctors Section
                    _buildDoctorsSection(controller),

                    const SizedBox(height: 100), // Space for floating button
                  ],
                ),
              ),
            ),
          ],
        ),

        // Floating Book Appointment Button
        floatingActionButton: _buildFloatingBookButton(controller),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      ),
    );
  }

  Widget _buildHeader(ServiceDetailController controller) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppColors.primaryBlue,
            AppColors.primaryBlueLight,
            AppColors.accentBlue,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative Circles
          Positioned(
            top: -40,
            right: -20,
            child: Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
          ),
          Positioned(
            bottom: -20,
            left: -40,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.08),
              ),
            ),
          ),

          // Content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // App Bar
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => Get.back(),
                        icon: const Icon(
                          Icons.arrow_back_ios,
                          color: Colors.white,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Service Details',
                        style: AppTextStyles.h3.copyWith(color: Colors.white),
                      ),
                      const Spacer(),
                      const SizedBox(width: 48), // Balance the back button
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceIcon() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryBlue.withValues(alpha: 0.1),
            AppColors.accentBlue.withValues(alpha: 0.1),
          ],
        ),
      ),
      child: const Icon(
        Icons.medical_services,
        size: 60,
        color: AppColors.primaryBlue,
      ),
    );
  }

  Widget _buildServiceInfoCard(ServiceDetailController controller) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.info_outline, color: AppColors.primaryBlue, size: 24),
              const SizedBox(width: 8),
              Text(
                'About This Service',
                style: AppTextStyles.h3.copyWith(color: AppColors.primaryBlue),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Description
          Text(
            controller.service.description.isNotEmpty
                ? controller.service.description
                : 'No description available for this service.',
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textPrimary,
              height: 1.6,
            ),
          ),

          const SizedBox(height: 20),

          // Duration Info
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.backgroundLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(Icons.access_time, color: AppColors.accentBlue, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Duration: ${controller.service.durationInMinutes} minutes',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorsSection(ServiceDetailController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.people_outline, color: AppColors.primaryBlue, size: 24),
            const SizedBox(width: 8),
            Text(
              'Available Doctors',
              style: AppTextStyles.h3.copyWith(color: AppColors.primaryBlue),
            ),
          ],
        ),

        const SizedBox(height: 8),

        Obx(() {
          if (controller.isLoadingDoctors.value) {
            return _buildDoctorsLoading();
          }

          if (controller.errorMessage.value != null) {
            return _buildDoctorsError(controller);
          }

          if (controller.doctors.isEmpty) {
            return _buildNoDoctors();
          }

          return _buildDoctorsList(controller);
        }),
      ],
    );
  }

  Widget _buildDoctorsLoading() {
    return SizedBox(
      height: 120,
      child: const Center(
        child: CircularProgressIndicator(color: AppColors.fountainBlue),
      ),
    );
  }

  Widget _buildDoctorsError(ServiceDetailController controller) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        children: [
          Icon(Icons.error_outline, color: AppColors.warningOrange, size: 48),
          const SizedBox(height: 12),
          Text(
            controller.errorMessage.value ?? 'Failed to load doctors',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: controller.retryLoadingDoctors,
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.primaryBlue),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Retry',
                style: AppTextStyles.button.copyWith(
                  color: AppColors.primaryBlue,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoDoctors() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        children: [
          Icon(Icons.person_off_outlined, color: AppColors.textHint, size: 48),
          const SizedBox(height: 12),
          Text(
            'No doctors available for this service at the moment.',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorsList(ServiceDetailController controller) {
    return SizedBox(
      height: 220, // Increased height to accommodate enhanced doctor cards
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: controller.doctors.length,
        itemBuilder: (context, index) {
          final doctor = controller.doctors[index];
          return _buildDoctorCard(doctor, controller);
        },
      ),
    );
  }

  Widget _buildDoctorCard(
    MedicalProfessional doctor,
    ServiceDetailController controller,
  ) {
    return Container(
      width: 120,
      constraints: const BoxConstraints(
        minHeight: 160,
        maxHeight: 220, // Prevent overflow by setting max height
      ),
      margin: const EdgeInsets.only(right: 16),
      child: GestureDetector(
        onTap: () => controller.onDoctorSelected(doctor),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            boxShadow: AppColors.cardShadow,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min, // Prevent overflow
            children: [
              // Doctor Avatar
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.backgroundLight,
                ),
                child: ClipOval(
                  child: doctor.profilePictureUrl?.isNotEmpty == true
                      ? Image.network(
                          ImageUtils.buildImageUrl(doctor.profilePictureUrl!),
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              _buildDoctorAvatar(),
                        )
                      : _buildDoctorAvatar(),
                ),
              ),

              const SizedBox(height: 8),

              // Doctor Name
              Text(
                doctor.fullName,
                style: AppTextStyles.bodySmall.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),

              const SizedBox(height: 4),

              // Job Title
              if (doctor.jobTitle?.isNotEmpty == true)
                Text(
                  doctor.jobTitle!,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.primaryBlue,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),

              // Specialization
              if (doctor.specialization?.isNotEmpty == true) ...[
                const SizedBox(height: 2),
                Text(
                  doctor.specialization!,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],

              // Educational Background
              if (doctor.educationalBackground?.isNotEmpty == true) ...[
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.accentBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    doctor.educationalBackground!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.accentBlue,
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],

              // Years of Experience
              if (doctor.yearsOfExperience != null &&
                  doctor.yearsOfExperience! > 0) ...[
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.work_outline,
                      size: 12,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 2),
                    Flexible(
                      child: Text(
                        '${doctor.yearsOfExperience} yrs exp',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 10,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDoctorAvatar() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primaryBlue.withValues(alpha: 0.1),
            AppColors.accentBlue.withValues(alpha: 0.1),
          ],
        ),
      ),
      child: const Icon(Icons.person, size: 30, color: AppColors.primaryBlue),
    );
  }

  Widget _buildFloatingBookButton(ServiceDetailController controller) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: CustomButton(
        text: 'Book Appointment',
        onPressed: controller.onBookAppointment,
        type: ButtonType.primary,
        icon: Icons.calendar_month,
      ),
    );
  }
}
