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
        statusBarIconBrightness: Brightness.light,
      ),
    );

    return Obx(() => PopScope(
      canPop: !controller.isEditing.value,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        controller.isEditing.value = false;
        controller.loadUserProfile(); // Reset changes
      },
      child: Scaffold(
        backgroundColor: AppColors.backgroundLight,
        body: Builder(builder: (context) {
            if (controller.isLoading.value && controller.currentUser.value == null) {
              return const Center(child: CircularProgressIndicator());
            }

            return Column(
            children: [
              // Header - Fixed at top
              // Header Section - Top Banner Style
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF0D47A1),
                      Color(0xFF1565C0),
                      Color(0xFF1976D2),
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
                      color: AppColors.primaryBlue.withOpacity(0.3),
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
                          color: Colors.white.withOpacity(0.1),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: -20,
                      left: -40,
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withOpacity(0.08),
                        ),
                      ),
                    ),
                    
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Settings',
                                      style: AppTextStyles.h2.copyWith(
                                        color: Colors.white,
                                        fontSize: 28,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Manage your account',
                                      style: AppTextStyles.bodyMedium.copyWith(
                                        color: Colors.white.withOpacity(0.9),
                                        fontSize: 16,
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
                                    size: 32,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
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
                      // Profile Avatar with Edit Button
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
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
                          // Edit Profile Icon Button
                          Obx(() => !controller.isEditing.value
                              ? Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: GestureDetector(
                                    onTap: controller.toggleEdit,
                                    child: Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: AppColors.primaryBlue,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: AppColors.backgroundLight,
                                          width: 3,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: AppColors.primaryBlue.withOpacity(0.3),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: const Icon(
                                        Icons.edit,
                                        color: Colors.white,
                                        size: 18,
                                      ),
                                    ),
                                  ),
                                )
                              : const SizedBox.shrink()),
                        ],
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
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.fNameController,
                        labelText: 'First Name',
                        prefixIcon: Icons.badge_outlined,
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.mNameController,
                        labelText: 'Middle Name',
                        prefixIcon: Icons.badge_outlined,
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.lNameController,
                        labelText: 'Last Name',
                        prefixIcon: Icons.badge_outlined,
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.emailController,
                        labelText: 'Email',
                        prefixIcon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 16),

                      CustomTextField(
                        controller: controller.phoneController,
                        labelText: 'Phone Number',
                        prefixIcon: Icons.phone_outlined,
                        keyboardType: TextInputType.phone,
                        enabled: controller.isEditing.value,
                      ),

                      const SizedBox(height: 32),

                      // Action Buttons
                      Obx(() {
                        if (controller.isEditing.value) {
                          return Column(
                            children: [
                              CustomButton(
                                text: 'Save Changes',
                                onPressed: controller.updateProfile,
                                isLoading: controller.isLoading.value,
                                type: ButtonType.primary,
                              ),
                              const SizedBox(height: 16),
                              CustomButton(
                                text: 'Cancel',
                                onPressed: () {
                                  controller.isEditing.value = false;
                                  controller.loadUserProfile(); // Reload to reset fields
                                },
                                type: ButtonType.secondary,
                              ),
                            ],
                          );
                        } else {
                          return Column(
                            children: [
                              TextButton.icon(
                                onPressed: controller.showChangePasswordDialog,
                                icon: const Icon(Icons.lock_outline, size: 18, color: AppColors.textSecondary),
                                label: Text(
                                  'Change Password',
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    color: AppColors.textSecondary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
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
    )));
  }
}
