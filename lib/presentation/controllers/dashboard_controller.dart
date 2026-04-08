import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'profile_controller.dart';
import 'medical_service_controller.dart';

class DashboardController extends GetxController {
  final currentIndex = 0.obs;
  final box = GetStorage();

  void changePage(int index) {
    currentIndex.value = index;
  }

  void logout() {
    Get.dialog(
      AlertDialog(
        title: Text('Confirm Logout'),
        content: Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Get.back(), child: Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Get.back(); // Close dialog
              clearSessionAndGoToLogin();
            },
            child: Text('Logout'),
          ),
        ],
      ),
    );
  }

  void clearSessionAndGoToLogin() {
    // Clear all stored user data
    box.remove('token');
    box.remove('user');
    box.remove('userId');
    box.remove('userFullname');
    box.remove('userFName');
    box.remove('userEmail');
    box.remove('last_login_time');
    box.remove('last_services_load_time');

    // Clear ProfileController data if it exists
    if (Get.isRegistered<ProfileController>()) {
      Get.find<ProfileController>().clearUserData();
    }

    // Clear MedicalServiceController data if it exists
    if (Get.isRegistered<MedicalServiceController>()) {
      Get.find<MedicalServiceController>().resetState();
    }

    Get.offAllNamed('/login');
  }
}
