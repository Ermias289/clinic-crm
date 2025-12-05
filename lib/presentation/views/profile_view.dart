import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../controllers/profile_controller.dart';
import '../controllers/dashboard_controller.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class ProfileView extends GetView<ProfileController> {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Obx(() {
          if (controller.isLoading.value && controller.currentUser.value == null) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              // Header - Fixed at top
              Container(
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: AppColors.cardShadow,
                ),
                padding: const EdgeInsets.all(24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Settings',
                          style: AppTextStyles.h2.copyWith(
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Manage your account',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.settings,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ],
                ),
              ),

              // Scrollable Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Profile Avatar
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.primaryBlue,
                            width: 3,
                          ),
                        ),
                        child: CircleAvatar(
                          radius: 60,
                          backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                          child: Icon(
                            Icons.person,
                            size: 60,
                            color: AppColors.primaryBlue,
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // User Role Badge
                      if (controller.currentUser.value?.roleName != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBlue.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            controller.currentUser.value!.roleName!,
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.primaryBlue,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),

                      const SizedBox(height: 32),

                      // Form Fields
                      CustomTextField(
                        controller: controller.usernameController,
                        labelText: 'Username',
                        prefixIcon: Icons.person_outline,
                        keyboardType: TextInputType.text,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.fNameController,
                        labelText: 'First Name',
                        prefixIcon: Icons.badge_outlined,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.mNameController,
                        labelText: 'Middle Name',
                        prefixIcon: Icons.badge_outlined,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.lNameController,
                        labelText: 'Last Name',
                        prefixIcon: Icons.badge_outlined,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.emailController,
                        labelText: 'Email',
                        prefixIcon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.phoneController,
                        labelText: 'Phone Number',
                        prefixIcon: Icons.phone_outlined,
                        keyboardType: TextInputType.phone,
                      ),

                      const SizedBox(height: 32),

                      // Action Buttons
                      Obx(() {
                        if (controller.isEditing.value) {
                          return CustomButton(
                            text: 'Save Changes',
                            onPressed: controller.updateProfile,
                            isLoading: controller.isLoading.value,
                            type: ButtonType.primary,
                          );
                        } else {
                          return Column(
                            children: [
                              CustomButton(
                                text: 'Edit Profile',
                                onPressed: controller.toggleEdit,
                                type: ButtonType.secondary,
                                icon: Icons.edit,
                              ),
                              const SizedBox(height: 16),
                              CustomButton(
                                text: 'Change Password',
                                onPressed: controller.showChangePasswordDialog,
                                type: ButtonType.secondary,
                                icon: Icons.lock_outline,
                              ),
                              const SizedBox(height: 16),
                              CustomButton(
                                text: 'Logout',
                                onPressed: () {
                                  final dashboardController = Get.find<DashboardController>();
                                  dashboardController.logout();
                                },
                                type: ButtonType.primary,
                                icon: Icons.logout,
                              ),
                            ],
                          );
                        }
                      }),
                    ],
                  ),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }
}
