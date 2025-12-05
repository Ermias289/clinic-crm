import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/login_controller.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Logo/Icon
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.medical_services_rounded,
                    size: 80,
                    color: AppColors.primaryBlue,
                  ),
                ),
                
                const SizedBox(height: 24),

                // Title
                Text(
                  "Dental Clinic",
                  style: AppTextStyles.h1.copyWith(
                    color: AppColors.primaryBlue,
                  ),
                ),
                
                const SizedBox(height: 8),

                // Subtitle
                Text(
                  "Welcome back! Please login to continue.",
                  textAlign: TextAlign.center,
                  style: AppTextStyles.subtitle,
                ),

                const SizedBox(height: 48),

                // Email/Phone Field
                CustomTextField(
                  controller: controller.emailController,
                  labelText: 'Email or Phone',
                  prefixIcon: Icons.person_outline,
                  keyboardType: TextInputType.emailAddress,
                ),

                const SizedBox(height: 16),

                // Password Field
                CustomTextField(
                  controller: controller.passwordController,
                  labelText: 'Password',
                  prefixIcon: Icons.lock_outline,
                  obscureText: true,
                ),

                const SizedBox(height: 32),

                // Login Button
                Obx(() => CustomButton(
                  text: "Login",
                  onPressed: controller.login,
                  isLoading: controller.isLoading.value,
                  type: ButtonType.primary,
                )),

                const SizedBox(height: 24),

                // Register Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account? ",
                      style: AppTextStyles.bodyMedium,
                    ),
                    TextButton(
                      onPressed: controller.goToRegister,
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(0, 0),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        "Register",
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
      ),
    );
  }
}
