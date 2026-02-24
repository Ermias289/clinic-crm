import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/register_request_model.dart';
import '../../../domain/usecases/register_usecase.dart';
import '../../config/app_routes.dart';

class RegisterController extends GetxController {
  final RegisterUseCase registerUseCase;

  RegisterController({required this.registerUseCase});

  final usernameController = TextEditingController();
  final fullnameController = TextEditingController();
  final fNameController = TextEditingController();
  final mNameController = TextEditingController();
  final lNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  // Patient role ID (will be fetched dynamically from backend)
  int? userRoleId;

  final isLoading = false.obs;

  /// Validates email format
  bool _isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  /// Validates phone number format
  bool _isValidPhone(String phone) {
    return RegExp(r'^\+?[0-9]\d{1,14}$').hasMatch(phone);
  }

  /// Register a new patient account
  Future<void> register() async {
    // Validate required fields
    if (usernameController.text.isEmpty) {
      Get.snackbar('Error', 'Username is required');
      return;
    }

    if (fNameController.text.isEmpty) {
      Get.snackbar('Error', 'First name is required');
      return;
    }

    if (lNameController.text.isEmpty) {
      Get.snackbar('Error', 'Last name is required');
      return;
    }

    if (emailController.text.isEmpty) {
      Get.snackbar('Error', 'Email is required');
      return;
    }

    if (!_isValidEmail(emailController.text)) {
      Get.snackbar('Error', 'Please enter a valid email address');
      return;
    }

    if (phoneController.text.isEmpty) {
      Get.snackbar('Error', 'Phone number is required');
      return;
    }

    if (!_isValidPhone(phoneController.text)) {
      Get.snackbar(
        'Error',
        'Please enter a valid phone number (e.g., +1234567890)',
      );
      return;
    }

    if (passwordController.text.isEmpty) {
      Get.snackbar('Error', 'Password is required');
      return;
    }

    if (passwordController.text.length < 8) {
      Get.snackbar('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (confirmPasswordController.text.isEmpty) {
      Get.snackbar('Error', 'Please confirm your password');
      return;
    }

    if (passwordController.text != confirmPasswordController.text) {
      Get.snackbar('Error', 'Passwords do not match');
      return;
    }

    isLoading.value = true;
    try {
      // Fetch Patient role ID dynamically if not already fetched
      if (userRoleId == null) {
        userRoleId = await registerUseCase.getPatientRoleId();
      }

      final fullname =
          '${fNameController.text} ${mNameController.text.isNotEmpty ? '${mNameController.text} ' : ''}${lNameController.text}';

      final request = RegisterRequestModel(
        username: usernameController.text.trim(),
        fullname: fullname.trim(),
        fName: fNameController.text.trim(),
        mName: mNameController.text.trim(),
        lName: lNameController.text.trim(),
        email: emailController.text.trim(),
        phoneNumber: phoneController.text.trim(),
        password: passwordController.text,
        userRoleId: userRoleId!,
      );

      final response = await registerUseCase(request);

      if (response.success) {
        Get.snackbar(
          'Success',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
        Get.offNamed(
          Routes.otpVerification,
          arguments: emailController.text.trim(),
        );
      } else {
        Get.snackbar(
          'Registration Failed',
          response.message,
          snackPosition: SnackPosition.BOTTOM,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        e.toString().replaceAll('Exception: ', ''),
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void goToLogin() {
    Get.back();
  }
}
