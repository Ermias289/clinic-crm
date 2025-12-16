import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../config/app_routes.dart';

class OTPVerificationController extends GetxController {
  final ApiClient apiClient = ApiClient();
  
  final email = ''.obs;
  final otpController = TextEditingController();
  final isLoading = false.obs;
  
  // Resend Timer logic
  final resendTimer = 30.obs;
  final canResend = false.obs;
  Timer? _timer;

  @override
  void onInit() {
    super.onInit();
    // Get email from arguments
    if (Get.arguments != null && Get.arguments is String) {
      email.value = Get.arguments;
    }
    startTimer();
    // Send OTP immediately upon entering this screen (or assumption is registration already sent it)
    // The instructions say "once user puts info... and click register... redirect... once we get successfully verified".
    // Usually backend sends the first OTP on registration. If not, we might need to trigger it here.
    // Assuming registration sends the first one.
    if (email.value.isNotEmpty) {
       // Ideally we just wait for user to input.
       // However, we can also trigger a send if needed.
       sendOtp();
    }
  }

  void startTimer() {
    resendTimer.value = 30;
    canResend.value = false;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (resendTimer.value == 0) {
        canResend.value = true;
        timer.cancel();
      } else {
        resendTimer.value--;
      }
    });
  }

  Future<void> sendOtp() async {
     try {
       // Trigger backend to send/resend OTP
       await apiClient.get('/OTP/resendOTP?recipientEmail=${email.value}');
     } catch (e) {
       print("Failed to send initial OTP: $e");
       // Don't block UI, maybe it was sent by register logic
     }
  }

  Future<void> resendOtp() async {
    try {
      startTimer();
      isLoading.value = true;
      final response = await apiClient.get('/OTP/resendOTP?recipientEmail=${email.value}');
      
      if (response.status.hasError) {
        Get.snackbar('Error', 'Failed to resend code');
      } else {
        Get.snackbar('Success', 'Code sent successfully');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to resend code: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyOtp() async {
    if (otpController.text.isEmpty) {
      Get.snackbar('Error', 'Please enter the code');
      return;
    }

    try {
      isLoading.value = true;
      
      final response = await apiClient.post(
        '/OTP/verifyOTP?email=${email.value}&submittedOtp=${otpController.text}',
        null, // No body needed as params are in query string based on controller signature
      );

      if (response.status.hasError) {
         // Try to parse error message from body if available
         final msg = response.bodyString ?? 'Invalid Code';
         Get.snackbar('Error', 'Verification failed: $msg');
      } else {
        Get.snackbar('Success', 'Email verified successfully!');
        // Navigate to Login
        Get.offAllNamed(Routes.LOGIN);
      }
    } catch (e) {
      Get.snackbar('Error', 'An error occurred: $e');
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    _timer?.cancel();
    otpController.dispose();
    super.onClose();
  }
}
