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
        statusBarIconBrightness: Brightness.light,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SingleChildScrollView(
        padding: EdgeInsets.zero,
        child: Column(
          children: [
            // Header Section
            Container(
              height: 200, // Slightly smaller than login
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
                        children: [
                         IconButton(
                            onPressed: () => Get.back(),
                            icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                            padding: EdgeInsets.zero,
                            alignment: Alignment.centerLeft,
                          ),
                          const Spacer(),
                          Text(
                            "Create Account",
                            style: AppTextStyles.h1.copyWith(
                              color: Colors.white,
                              fontSize: 28,
                            ),
                          ),
                          Text(
                            "Join our dental clinic family",
                            style: AppTextStyles.bodyMedium.copyWith(
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
                  Text("Personal Info", style: AppTextStyles.h3.copyWith(color: AppColors.primaryBlue)),
                  const SizedBox(height: 16),
                  
                  // Username
                  CustomTextField(
                    controller: controller.usernameController,
                    labelText: 'Username',
                    prefixIcon: Icons.person_outline_rounded,
                  ),

                  const SizedBox(height: 16),

                  // Name Row
                  Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: controller.fNameController,
                          labelText: 'First Name',
                          prefixIcon: Icons.badge_outlined,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CustomTextField(
                          controller: controller.lNameController,
                          labelText: 'Last Name',
                          prefixIcon: Icons.badge_outlined,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  CustomTextField(
                    controller: controller.mNameController,
                    labelText: 'Middle Name (Optional)',
                    prefixIcon: Icons.badge_outlined,
                  ),

                  const SizedBox(height: 16),

                  // Contact Info
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

                  const SizedBox(height: 24),
                  Text("Security", style: AppTextStyles.h3.copyWith(color: AppColors.primaryBlue)),
                  const SizedBox(height: 16),

                  // Password
                  CustomTextField(
                    controller: controller.passwordController,
                    labelText: 'Password',
                    prefixIcon: Icons.lock_outline_rounded,
                    obscureText: true,
                  ),

                  const SizedBox(height: 16),

                  // Confirm Password
                  CustomTextField(
                    controller: controller.confirmPasswordController,
                    labelText: 'Confirm Password',
                    prefixIcon: Icons.lock_outline_rounded,
                    obscureText: true,
                  ),

                  const SizedBox(height: 32),

                  // Register Button
                  Obx(() => SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: controller.isLoading.value ? null : controller.register,
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
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text("Create Account", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
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
                        child: Text(
                          "Login",
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
