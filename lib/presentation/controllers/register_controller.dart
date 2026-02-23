import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/register_request_model.dart';
import '../../../domain/usecases/register_usecase.dart';
import '../../config/app_routes.dart';
import '../../core/utils/error_handler.dart';

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
      ErrorHandler.showError('Username is required');
      return;
    }

    if (fNameController.text.isEmpty) {
      ErrorHandler.showError('First name is required');
      return;
    }

    if (lNameController.text.isEmpty) {
      ErrorHandler.showError('Last name is required');
      return;
    }

    if (emailController.text.isEmpty) {
      ErrorHandler.showError('Email is required');
      return;
    }

    if (!_isValidEmail(emailController.text)) {
      ErrorHandler.showError('Please enter a valid email address');
      return;
    }

    if (phoneController.text.isEmpty) {
      ErrorHandler.showError('Phone number is required');
      return;
    }

    if (!_isValidPhone(phoneController.text)) {
      ErrorHandler.showError(
        'Please enter a valid phone number (e.g., +1234567890)',
      );
      return;
    }

    if (passwordController.text.isEmpty) {
      ErrorHandler.showError('Password is required');
      return;
    }

    if (passwordController.text.length < 8) {
      ErrorHandler.showError('Password must be at least 8 characters long');
      return;
    }

    if (confirmPasswordController.text.isEmpty) {
      ErrorHandler.showError('Please confirm your password');
      return;
    }

    if (passwordController.text != confirmPasswordController.text) {
      ErrorHandler.showError('Passwords do not match');
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
        ErrorHandler.showSuccess(response.message);
        Get.offNamed(
          Routes.otpVerification,
          arguments: emailController.text.trim(),
        );
      } else {
        ErrorHandler.showError(response.message, title: 'Registration Failed');
      }
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Registration Error');
    } finally {
      isLoading.value = false;
    }
  }

  void goToLogin() {
    Get.back();
  }
}
