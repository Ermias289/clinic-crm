import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResetPasswordController extends GetxController {
  final otpController = TextEditingController();
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final successMessage = ''.obs;

  // Base URL for your API - change this to match your backend URL
  final String baseUrl = 'http://localhost:5000/api/auth';
  
  late String email;

  @override
  void onInit() {
    super.onInit();
    email = Get.arguments['email'] ?? '';
  }

  Future<void> resetPassword() async {
    if (otpController.text.isEmpty) {
      errorMessage.value = 'Please enter the verification code';
      return;
    }

    if (newPasswordController.text.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters long';
      return;
    }

    if (newPasswordController.text != confirmPasswordController.text) {
      errorMessage.value = 'Passwords do not match';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/resetPassword'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'newPassword': newPasswordController.text,
          'otp': otpController.text,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        successMessage.value = responseData['message'] ?? 'Password reset successfully';
        
        // Navigate back to login screen with success message
        Get.offNamedUntil('/login', (route) => false, arguments: {'success': successMessage.value});
      } else {
        final errorData = jsonDecode(response.body);
        errorMessage.value = errorData['message'] ?? 'Failed to reset password';
      }
    } catch (e) {
      errorMessage.value = 'Network error. Please check your connection and try again.';
    } finally {
      isLoading.value = false;
    }
  }

  void goBack() {
    Get.back(); // Go back to forgot password screen
  }

  @override
  void onClose() {
    otpController.dispose();
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
