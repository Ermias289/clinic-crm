import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../controllers/register_controller.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class RegisterView extends GetView<RegisterController> {
  const RegisterView({super.key});

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
        child: Column(
          children: [
            // Header Card - Rounded like other pages
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
                        'Create Account',
                        style: AppTextStyles.h2.copyWith(
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Join our dental clinic',
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
                      Icons.person_add,
                      color: Colors.white,
                      size: 28,
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Text(
                      "Join Us",
                      style: AppTextStyles.h2.copyWith(
                        color: AppColors.primaryBlue,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Fill in your details to get started",
                      style: AppTextStyles.subtitle,
                    ),

                    const SizedBox(height: 32),

                    // Username
                    CustomTextField(
                      controller: controller.usernameController,
                      labelText: 'Username',
                      prefixIcon: Icons.person_outline,
                    ),

                    const SizedBox(height: 16),

                    // First Name
                    CustomTextField(
                      controller: controller.fNameController,
                      labelText: 'First Name',
                      prefixIcon: Icons.badge_outlined,
                    ),

                    const SizedBox(height: 16),

                    // Middle Name
                    CustomTextField(
                      controller: controller.mNameController,
                      labelText: 'Middle Name (Optional)',
                      prefixIcon: Icons.badge_outlined,
                    ),

                    const SizedBox(height: 16),

                    // Last Name
                    CustomTextField(
                      controller: controller.lNameController,
                      labelText: 'Last Name',
                      prefixIcon: Icons.badge_outlined,
                    ),

                    const SizedBox(height: 16),

                    // Email
                    CustomTextField(
                      controller: controller.emailController,
                      labelText: 'Email',
                      prefixIcon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                    ),

                    const SizedBox(height: 16),

                    // Phone
                    CustomTextField(
                      controller: controller.phoneController,
                      labelText: 'Phone Number',
                      prefixIcon: Icons.phone_outlined,
                      keyboardType: TextInputType.phone,
                    ),

                    const SizedBox(height: 16),

                    // Password
                    CustomTextField(
                      controller: controller.passwordController,
                      labelText: 'Password',
                      prefixIcon: Icons.lock_outline,
                      obscureText: true,
                    ),

                    const SizedBox(height: 16),

                    // Confirm Password
                    CustomTextField(
                      controller: controller.confirmPasswordController,
                      labelText: 'Confirm Password',
                      prefixIcon: Icons.lock_outline,
                      obscureText: true,
                    ),

                    const SizedBox(height: 32),

                    // Register Button
                    Obx(() => CustomButton(
                      text: "Register",
                      onPressed: controller.register,
                      isLoading: controller.isLoading.value,
                      type: ButtonType.primary,
                    )),

                    const SizedBox(height: 24),

                    // Login Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Already have an account? ",
                          style: AppTextStyles.bodyMedium,
                        ),
                        TextButton(
                          onPressed: controller.goToLogin,
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(0, 0),
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            "Login",
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: AppColors.primaryBlue,
                              fontWeight: FontWeight.w600,
                            ),
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
    );
  }
}
