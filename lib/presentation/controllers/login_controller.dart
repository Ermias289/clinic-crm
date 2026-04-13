import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../../data/models/login_request_model.dart';
import '../../../domain/usecases/login_usecase.dart';

import '../../core/utils/error_handler.dart';

class LoginController extends GetxController {
  final LoginUseCase loginUseCase;
  final box = GetStorage();

  LoginController({required this.loginUseCase});

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;

  Future<void> login() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      ErrorHandler.showError('Please fill in all fields', title: 'Start Login');
      return;
    }

    isLoading.value = true;

    try {
      final request = LoginRequestModel(
        phoneOrEmail: emailController.text,
        password: passwordController.text,
      );
      final response = await loginUseCase(request);

      // Save token, user info, and userId
      await box.write('token', response.token);
      await box.write('user', response.user.username);
      await box.write('userId', response.user.id);
      // Save additional user data for immediate display
      await box.write('userFullname', response.user.fullname);
      await box.write('userFName', response.user.fName);
      await box.write('userEmail', response.user.email);

      // Mark login time for services reload detection
      await box.write('last_login_time', DateTime.now().millisecondsSinceEpoch);

      // Small delay to ensure token is properly saved
      await Future.delayed(const Duration(milliseconds: 50));

      // Redirect to dashboard and set services tab as active
      Get.offAllNamed('/dashboard', arguments: {'initialTab': 2});
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Login Failed');
    } finally {
      isLoading.value = false;
    }
  }

  void goToRegister() {
    Get.toNamed('/register');
  }
}
