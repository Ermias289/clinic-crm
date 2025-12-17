import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../config/app_routes.dart';
import '../../../core/api_client.dart';

class ResetPasswordController extends GetxController {
  /// Uses the same GetConnect-based client as the rest of the app (respects `.env` API_BASE_URL)
  final ApiClient _apiClient = ApiClient();

  final otpController = TextEditingController();
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final successMessage = ''.obs;

  /// Email passed from the Forgot Password screen
  late final String email;

  @override
  void onInit() {
    super.onInit();

    final args = Get.arguments;
    final argEmail =
        (args is Map ? (args['email'] as String?) : null)?.trim() ?? '';

    email = argEmail;

    if (email.isEmpty) {
      // Fail fast; without email we can't verify OTP against backend.
      errorMessage.value = 'Missing email. Please restart the reset flow.';
    }
  }

  /// Verifies the OTP (token) against the backend.
  ///
  /// Backend in this repo supports:
  /// - `POST /api/OTP/verifyOTP?email=...&submittedOtp=...`
  ///
  /// If verification succeeds, it navigates back to login.
  ///
  /// Note: The backend in this repo does NOT implement a password reset endpoint,
  /// so we cannot actually set a new password here without backend changes.
  Future<void> resetPassword() async {
    if (email.isEmpty) {
      errorMessage.value = 'Missing email. Please restart the reset flow.';
      return;
    }

    final otp = otpController.text.trim();
    if (otp.isEmpty) {
      errorMessage.value = 'Please enter the verification code';
      return;
    }

    // Keep validation to avoid a misleading UX, even though backend reset isn't implemented yet.
    final newPassword = newPasswordController.text;
    if (newPassword.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters long';
      return;
    }
    if (newPassword != confirmPasswordController.text) {
      errorMessage.value = 'Passwords do not match';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      final encodedEmail = Uri.encodeQueryComponent(email.toLowerCase().trim());
      final encodedOtp = Uri.encodeQueryComponent(otp);

      final response = await _apiClient.post(
        '/api/OTP/verifyOTP?email=$encodedEmail&submittedOtp=$encodedOtp',
        null,
      );

      if (response.status.hasError) {
        final msg = _extractMessage(response.body) ??
            response.bodyString ??
            'Invalid verification code';
        errorMessage.value = msg;
        return;
      }

      // OTP verified successfully.
      // Since backend reset-password endpoint isn't present, we only confirm verification.
      successMessage.value =
          _extractMessage(response.body) ?? 'Verification successful';

      Get.offNamedUntil(
        Routes.LOGIN,
        (route) => false,
        arguments: {'success': successMessage.value},
      );
    } catch (e) {
      errorMessage.value =
          'Network error. Please check your connection and try again.';
    } finally {
      isLoading.value = false;
    }
  }

  void goBack() {
    Get.back();
  }

  String? _extractMessage(dynamic body) {
    try {
      if (body == null) return null;

      if (body is Map) {
        final message = body['message'] ?? body['Message'];
        if (message is String && message.trim().isNotEmpty) return message.trim();
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
          return s; // plain text
        }
      }
    } catch (_) {
      // ignore parsing errors
    }
    return null;
  }

  @override
  void onClose() {
    otpController.dispose();
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
