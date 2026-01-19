import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import '../controllers/register_controller.dart';
import '../widgets/custom_text_field.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class RegisterView extends GetView<RegisterController> {
  RegisterView({super.key});

  final _formKey = GlobalKey<FormState>();

  // Method to launch Terms and Conditions URL
  Future<void> _launchTermsAndConditions() async {
    final Uri url = Uri.parse(
      'https://termsandconditions.nexabusinessgroup.com/',
    );
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      Get.snackbar(
        'Error',
        'Could not open Terms and Conditions',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    }
  }

  // Validation functions
  String? _validateName(String? value) {
    if (value == null || value.isEmpty) return 'This field is required';
    if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value))
      return 'Only letters and spaces allowed';
    if (value.length < 2) return 'At least 2 characters';
    return null;
  }

  String? _validateUsername(String? value) {
    if (value == null || value.isEmpty) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(value))
      return 'Username can only contain letters, numbers, and underscores';
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value))
      return 'Enter a valid email';
    return null;
  }

  String? _validatePhone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    if (!RegExp(r'^\d{10}$').hasMatch(value))
      return 'Enter a 10 digit phone number';
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) return 'Confirm password is required';
    if (value != controller.passwordController.text)
      return 'Passwords do not match';
    return null;
  }

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
        child: Column(
          children: [
            // Header Section
            Container(
              height: 180,
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
                  SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24.0,
                        vertical: 5,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          IconButton(
                            onPressed: () => Get.back(),
                            icon: const Icon(
                              Icons.arrow_back_ios,
                              color: Colors.white,
                            ),
                            padding: EdgeInsets.zero,
                            alignment: Alignment.centerLeft,
                          ),
                          const SizedBox(height: 5),
                          Text(
                            "Create Account",
                            style: AppTextStyles.h1.copyWith(
                              color: Colors.white,
                              fontSize: 24,
                            ),
                          ),
                          Text(
                            "Join Seid dental clinic family",
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 14,
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
            Form(
              key: _formKey,
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Username
                    CustomTextField(
                      controller: controller.usernameController,
                      labelText: 'Username',
                      prefixIcon: Icons.person_outline_rounded,
                      validator: _validateUsername,
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                          RegExp(r'[a-zA-Z0-9_]'),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Name Row
                    Row(
                      children: [
                        Expanded(
                          child: CustomTextField(
                            controller: controller.fNameController,
                            labelText: 'First Name',
                            prefixIcon: Icons.badge_outlined,
                            validator: _validateName,
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[a-zA-Z\s]'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: CustomTextField(
                            controller: controller.lNameController,
                            labelText: 'Last Name',
                            prefixIcon: Icons.badge_outlined,
                            validator: _validateName,
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[a-zA-Z\s]'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Contact Info
                    CustomTextField(
                      controller: controller.emailController,
                      labelText: 'Email',
                      prefixIcon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                      validator: _validateEmail,
                    ),

                    const SizedBox(height: 12),

                    CustomTextField(
                      controller: controller.phoneController,
                      labelText: 'Phone Number',
                      prefixIcon: Icons.phone_outlined,
                      keyboardType: TextInputType.phone,
                      validator: _validatePhone,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    ),

                    const SizedBox(height: 12),

                    // Password
                    CustomTextField(
                      controller: controller.passwordController,
                      labelText: 'Password',
                      prefixIcon: Icons.lock_outline_rounded,
                      obscureText: true,
                      validator: _validatePassword,
                    ),

                    const SizedBox(height: 12),

                    // Confirm Password
                    CustomTextField(
                      controller: controller.confirmPasswordController,
                      labelText: 'Confirm Password',
                      prefixIcon: Icons.lock_outline_rounded,
                      obscureText: true,
                      validator: _validateConfirmPassword,
                    ),

                    const SizedBox(height: 24),

                    // Terms and Conditions Agreement
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppColors.primaryBlue.withValues(alpha: 0.2),
                          width: 1,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.info_outline,
                                color: AppColors.primaryBlue,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Terms & Conditions',
                                style: AppTextStyles.bodyMedium.copyWith(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primaryBlue,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          RichText(
                            text: TextSpan(
                              style: AppTextStyles.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                                height: 1.4,
                              ),
                              children: [
                                const TextSpan(
                                  text:
                                      'By clicking "Create Account", you agree to our ',
                                ),
                                WidgetSpan(
                                  child: GestureDetector(
                                    onTap: _launchTermsAndConditions,
                                    child: Text(
                                      'Terms and Conditions',
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.primaryBlue,
                                        fontWeight: FontWeight.bold,
                                        decoration: TextDecoration.underline,
                                      ),
                                    ),
                                  ),
                                ),
                                const TextSpan(
                                  text:
                                      '. Please read them carefully before proceeding.',
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Register Button
                    Obx(
                      () => SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: controller.isLoading.value
                              ? null
                              : () {
                                  if (_formKey.currentState!.validate()) {
                                    controller.register();
                                  }
                                },
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
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text(
                                  "Create Account",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

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
                    const SizedBox(height: 20),
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
