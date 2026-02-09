import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../config/app_routes.dart';
import '../../../core/api_client.dart';
import '../../core/utils/error_handler.dart';

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

  /// Resets the password using the backend's `POST /api/Auth/changePassword` endpoint.
  ///
  /// Important: Do NOT call `/api/OTP/verifyOTP` here.
  /// The backend password reset flow verifies the OTP inside `changePassword`, and
  /// `verifyOTP` would consume the OTP first (making the reset fail).
  Future<void> resetPassword() async {
    if (email.isEmpty) {
      errorMessage.value = 'Missing email. Please restart the reset flow.';
      return;
    }

    final otp = otpController.text.trim().toUpperCase();
    if (otp.isEmpty) {
      errorMessage.value = 'Please enter the verification code';
      return;
    }

    // Keep validation to avoid a misleading UX, even though backend reset isn't implemented yet.
    final newPassword = newPasswordController.text;
    if (newPassword.length < 8) {
      errorMessage.value = 'Password must be at least 8 characters long';
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
      final response = await _apiClient.post('/Auth/changePassword', {
        'phoneOrEmail': email.toLowerCase().trim(),
        'password': '',
        'newPassword': newPassword,
        'otp': otp,
        'reset': true,
      });

      if (response.status.hasError) {
        final msg =
            _extractMessage(response.body) ??
            response.bodyString ??
            'Failed to reset password';
        errorMessage.value = msg;
        return;
      }

      final message =
          _extractMessage(response.body) ?? 'Password reset successfully';
      successMessage.value = message;

      // Show success message
      ErrorHandler.showSuccess(message);

      // Wait for 2 seconds before navigating to login
      await Future.delayed(const Duration(seconds: 2));

      // Navigate to login page
      Get.offNamedUntil(
        Routes.login,
        (route) => false,
        arguments: {'success': message},
      );
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Reset Failed');
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
