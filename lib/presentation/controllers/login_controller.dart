import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../../data/models/login_request_model.dart';
import '../../../domain/usecases/login_usecase.dart';

class LoginController extends GetxController {
  final LoginUseCase loginUseCase;
  final box = GetStorage();

  LoginController({required this.loginUseCase});

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final isLoading = false.obs;

  Future<void> login() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      Get.snackbar('Error', 'Please fill in all fields');
      return;
    }

    isLoading.value = true;
    
    // TEMPORARY: Mock login for testing without backend
    // TODO: Remove this before production
    if (emailController.text == 'aaa' && passwordController.text == 'aaa') {
      await Future.delayed(const Duration(milliseconds: 500)); // Simulate API call
      
      // Mock user data
      await box.write('token', 'mock_token_12345');
      await box.write('user', 'Test User');
      await box.write('userId', 1);
      
      isLoading.value = false;
      Get.offAllNamed('/dashboard');
      return;
    }
    // END TEMPORARY
    
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
      
      Get.offAllNamed('/dashboard');
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
    }
  }
  
  void goToRegister() {
    Get.toNamed('/register');
  }
}
