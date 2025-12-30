import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'profile_controller.dart';

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
              // Clear all stored user data
              box.remove('token');
              box.remove('user');
              box.remove('userId');
              box.remove('userFullname');
              box.remove('userFName');
              box.remove('userEmail');

              // Clear ProfileController data if it exists
              if (Get.isRegistered<ProfileController>()) {
                Get.find<ProfileController>().clearUserData();
              }

              Get.offAllNamed('/login');
            },
            child: Text('Logout'),
          ),
        ],
      ),
    );
  }
}
