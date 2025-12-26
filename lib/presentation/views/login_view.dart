import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../../config/app_routes.dart';
import '../controllers/login_controller.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness:
            Brightness.light, // Light icons for dark gradient
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SingleChildScrollView(
        // Changed to ensure scrolling on small screens
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            // Header Section
            Container(
              height: 280, // Taller header
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
                  bottomLeft: Radius.circular(40),
                  bottomRight: Radius.circular(40),
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
                    top: -50,
                    right: -50,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.1),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -30,
                    left: -30,
                    child: Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.1),
                      ),
                    ),
                  ),

                  // Header Content
                  SafeArea(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Icon(
                              Icons.medical_services_rounded,
                              size: 48,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            "Lucid Dental Clinic",
                            style: AppTextStyles.h1.copyWith(
                              color: Colors.white,
                              fontSize: 32,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "Welcome Back",
                            style: AppTextStyles.bodyLarge.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Form Section
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  Text(
                    "Login",
                    style: AppTextStyles.h2.copyWith(
                      color: AppColors.primaryBlue,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Please sign in to continue",
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Email/Phone Field
                  CustomTextField(
                    controller: controller.emailController,
                    labelText: 'Email or Phone',
                    prefixIcon: Icons.person_outline_rounded,
                    keyboardType: TextInputType.emailAddress,
                  ),

                  const SizedBox(height: 20),

                  // Password Field
                  CustomTextField(
                    controller: controller.passwordController,
                    labelText: 'Password',
                    prefixIcon: Icons.lock_outline_rounded,
                    obscureText: true,
                  ),

                  // Forgot Password
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () => Get.toNamed(Routes.FORGOT_PASSWORD),
                      child: Text(
                        "Forgot Password?",
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.primaryBlue,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Login Button
                  Obx(
                    () => SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: controller.isLoading.value
                            ? null
                            : controller.login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          elevation: 8,
                          shadowColor: AppColors.primaryBlue.withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: controller.isLoading.value
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text(
                                "Login",
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                  ),

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
                        child: Text(
                          "Register",
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.primaryBlue,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
