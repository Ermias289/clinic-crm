import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../config/app_routes.dart';
import '../../core/utils/error_handler.dart';

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
      final encodedEmail = Uri.encodeQueryComponent(
        email.value.toLowerCase().trim(),
      );
      await apiClient.get('/OTP/resendOTP?recipientEmail=$encodedEmail');
    } catch (e) {}
  }

  Future<void> resendOtp() async {
    try {
      startTimer();
      isLoading.value = true;
      final encodedEmail = Uri.encodeQueryComponent(
        email.value.toLowerCase().trim(),
      );
      final response = await apiClient.get(
        '/OTP/resendOTP?recipientEmail=$encodedEmail',
      );

      if (response.status.hasError) {
        ErrorHandler.showError('Unable to resend code');
      } else {
        ErrorHandler.showSuccess('Code sent successfully');
      }
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Resend Failed');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyOtp() async {
    if (otpController.text.isEmpty) {
      ErrorHandler.showError('Please enter the code');
      return;
    }

    try {
      isLoading.value = true;

      final processedEmail = email.value.toLowerCase().trim();
      final processedOtp = otpController.text.trim().toUpperCase();
      final encodedEmail = Uri.encodeQueryComponent(processedEmail);
      final encodedOtp = Uri.encodeQueryComponent(processedOtp);

      final response = await apiClient.post(
        '/OTP/verifyOTP?email=$encodedEmail&submittedOtp=$encodedOtp',
        null,
      );

      if (response.status.hasError) {
        ErrorHandler.showError('Invalid verification code');
      } else {
        ErrorHandler.showSuccess('Email verified successfully!');
        // Navigate to Login
        Get.offAllNamed(Routes.login);
      }
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Verification Error');
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

  String? _extractMessage(dynamic body) {
    try {
      if (body == null) return null;

      if (body is Map) {
        final message = body['message'] ?? body['Message'];
        if (message is String && message.trim().isNotEmpty)
          return message.trim();
      }

      if (body is String) {
        final s = body.trim();
        if (s.isEmpty) return null;

        try {
          final decoded = jsonDecode(s);
          if (decoded is Map) {
            final message = decoded['message'] ?? decoded['Message'];
            if (message is String && message.trim().isNotEmpty) {
              return message.trim();
            }
          }
        } catch (_) {
          return s;
        }
      }
    } catch (_) {
      // ignore parsing errors
    }
    return null;
  }
}
