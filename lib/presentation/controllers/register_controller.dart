import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/register_request_model.dart';
import '../../../domain/usecases/register_usecase.dart';

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
  
  // Default user role ID (assuming 2 is for standard user, 1 for admin based on API ref)
  final int userRoleId = 2; 

  final isLoading = false.obs;

  Future<void> register() async {
    if (usernameController.text.isEmpty || 
        emailController.text.isEmpty || 
        passwordController.text.isEmpty) {
      Get.snackbar('Error', 'Please fill in required fields');
      return;
    }

    isLoading.value = true;
    try {
      final request = RegisterRequestModel(
        username: usernameController.text,
        fullname: fullnameController.text.isNotEmpty ? fullnameController.text : '${fNameController.text} ${lNameController.text}',
        fName: fNameController.text,
        mName: mNameController.text,
        lName: lNameController.text,
        email: emailController.text,
        phoneNumber: phoneController.text,
        password: passwordController.text,
        userRoleId: userRoleId,
      );

      final response = await registerUseCase(request);
      
      if (response.success) {
        Get.snackbar('Success', response.message);
        Get.offNamed('/login');
      } else {
        Get.snackbar('Error', response.message);
      }
    } catch (e) {
      Get.snackbar('Error', e.toString());
    } finally {
      isLoading.value = false;
    }
  }
  
  void goToLogin() {
    Get.back();
  }
}
