import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../widgets/custom_button.dart';
import '../controllers/otp_verification_controller.dart';

class OTPVerificationView extends GetView<OTPVerificationController> {
  const OTPVerificationView({super.key});

  @override
  Widget build(BuildContext context) {
    // Ensure controller is initialized
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Standard App Header
            Container(
              height: 250,
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
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.mark_email_read_outlined,
                              size: 48,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Verification',
                            style: AppTextStyles.h1.copyWith(
                              color: Colors.white,
                              fontSize: 32,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Enter the code sent to your email',
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

            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  const SizedBox(height: 32),

                  Text(
                    'Verification Code',
                    style: AppTextStyles.h2.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Obx(
                    () => Text(
                      'We sent a code to ${controller.email.value}',
                      textAlign: TextAlign.center,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // OTP Input Field
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: AppColors.softShadow,
                      border: Border.all(
                        color: AppColors.primaryBlue.withOpacity(0.1),
                      ),
                    ),
                    child: TextField(
                      controller: controller.otpController,
                      keyboardType: TextInputType.text, // Alphanumeric
                      textAlign: TextAlign.center,
                      style: AppTextStyles.h2.copyWith(
                        letterSpacing: 8,
                        color: AppColors.primaryBlue,
                      ),
                      maxLength: 6,
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        counterText: '',
                        hintText: 'ABCD12',
                        hintStyle: TextStyle(
                          letterSpacing: 2,
                          color: Colors.black12,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 48),

                  // Verify Button
                  Obx(
                    () => CustomButton(
                      text: 'Verify Email',
                      onPressed: controller.verifyOtp,
                      isLoading: controller.isLoading.value,
                      type: ButtonType.primary,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Resend Link
                  Obx(
                    () => TextButton(
                      onPressed: controller.canResend.value
                          ? controller.resendOtp
                          : null,
                      child: Text(
                        controller.canResend.value
                            ? 'Resend Code'
                            : 'Resend code in ${controller.resendTimer.value}s',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: controller.canResend.value
                              ? AppColors.primaryBlue
                              : AppColors.textHint,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
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
