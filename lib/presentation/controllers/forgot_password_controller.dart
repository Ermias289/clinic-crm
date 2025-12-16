import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ForgotPasswordController extends GetxController {
  final emailController = TextEditingController();
  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final successMessage = ''.obs;

  // Base URL for your API - change this to match your backend URL
  final String baseUrl = 'http://localhost:5000/api/auth';

  Future<void> sendResetEmail() async {
    if (emailController.text.isEmpty || !GetUtils.isEmail(emailController.text)) {
      errorMessage.value = 'Please enter a valid email address';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/forgotPassword'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': emailController.text.trim()}),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        successMessage.value = responseData['message'] ?? 'Reset email sent successfully';
        
        // Navigate to reset password screen
        Get.toNamed('/reset-password', arguments: {'email': emailController.text.trim()});
        // Note: Could also use Get.toNamed(Routes.RESET_PASSWORD, arguments: {'email': emailController.text.trim()});
      } else {
        final errorData = jsonDecode(response.body);
        errorMessage.value = errorData['message'] ?? 'Failed to send reset email';
      }
    } catch (e) {
      errorMessage.value = 'Network error. Please check your connection and try again.';
    } finally {
      isLoading.value = false;
    }
  }

  void goToLogin() {
    Get.back(); // Go back to login screen
  }

  @override
  void onClose() {
    emailController.dispose();
    super.onClose();
  }
}
