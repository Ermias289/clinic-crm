import 'package:flutter/material.dart';
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
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Create Account'),
        backgroundColor: AppColors.primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SafeArea(
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
                "Create your account to get started",
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
    );
  }
}
