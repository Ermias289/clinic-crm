import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/api_client.dart';
import '../../../config/app_routes.dart';

class ForgotPasswordController extends GetxController {
  /// Uses the same GetConnect-based client as the rest of the app (respects `.env` API_BASE_URL)
  final ApiClient _apiClient = ApiClient();

  final emailController = TextEditingController();

  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final successMessage = ''.obs;

  /// Sends the user's email to the backend to start the password reset flow.
  ///
  /// Backend expectation (based on your backend app currently in this repo):
  /// - There is no `/auth/forgotPassword` endpoint implemented.
  /// - OTP is handled by `POST /api/OTP/verifyOTP` and `GET /api/OTP/resendOTP`.
  ///
  /// So this implementation uses `GET /api/OTP/resendOTP?recipientEmail=...` to trigger
  /// an email with the token/OTP.
  Future<void> sendResetEmail() async {
    final rawEmail = emailController.text.trim();

    if (rawEmail.isEmpty || !GetUtils.isEmail(rawEmail)) {
      errorMessage.value = 'Please enter a valid email address';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      final encodedEmail = Uri.encodeQueryComponent(rawEmail.toLowerCase());

      final response = await _apiClient.get(
        '/api/OTP/resendOTP?recipientEmail=$encodedEmail',
      );

      if (response.status.hasError) {
        final msg = _extractMessage(response.body) ??
            response.bodyString ??
            'Failed to send reset email';
        errorMessage.value = msg;
        return;
      }

      successMessage.value =
          _extractMessage(response.body) ?? 'Reset code sent successfully';

      // Navigate to reset password screen and pass the email along
      Get.toNamed(
        Routes.RESET_PASSWORD,
        arguments: {'email': rawEmail.toLowerCase()},
      );
    } catch (e) {
      errorMessage.value =
          'Network error. Please check your connection and try again.';
    } finally {
      isLoading.value = false;
    }
  }

  void goToLogin() {
    Get.offAllNamed(Routes.LOGIN);
  }

  /// Tries to extract a human friendly message from varying backend responses.
  String? _extractMessage(dynamic body) {
    try {
      if (body == null) return null;

      if (body is Map) {
        final message = body['message'] ?? body['Message'];
        if (message is String && message.trim().isNotEmpty) return message.trim();
      }

      if (body is String) {
        // Might be plain text or JSON string
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
          // not JSON, return as-is
          return s;
        }
      }
    } catch (_) {
      // ignore parsing failures
    }

    return null;
  }

  @override
  void onClose() {
    emailController.dispose();
    super.onClose();
  }
}
