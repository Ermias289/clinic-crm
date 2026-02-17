import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../data/models/user_model.dart';

class ProfileController extends GetxController {
  final UserRemoteDataSource userDataSource;
  final box = GetStorage();

  ProfileController({required this.userDataSource});

  final isLoading = false.obs;
  final isEditing = false.obs;

  // User data
  final Rx<UserModel?> currentUser = Rx<UserModel?>(null);

  // Form controllers
  final usernameController = TextEditingController();
  final fullnameController = TextEditingController();
  final fNameController = TextEditingController();
  final mNameController = TextEditingController();
  final lNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();

  // Password change controllers
  final oldPasswordController = TextEditingController();
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  @override
  void onInit() {
    super.onInit();
    // Load stored user data immediately for quick display
    loadStoredUserData();
    // Then load full profile from API
    loadUserProfile();
  }

  void loadStoredUserData() {
    // Get stored user data from login for immediate display
    final storedUsername = box.read('user');
    final storedUserId = box.read('userId');
    final storedFullname = box.read('userFullname');
    final storedFName = box.read('userFName');
    final storedEmail = box.read('userEmail');

    if (storedUsername != null && storedUserId != null) {
      // Create a user model with stored data for immediate display
      currentUser.value = UserModel(
        id: storedUserId,
        username: storedUsername,
        fullname: storedFullname ?? storedFName ?? storedUsername,
        fName: storedFName ?? storedUsername,
        email: storedEmail,
      );

      // Also populate form controllers with stored data
      usernameController.text = storedUsername;
      fullnameController.text = storedFullname ?? storedFName ?? storedUsername;
      fNameController.text = storedFName ?? storedUsername;
      emailController.text = storedEmail ?? '';
    }
  }

  void clearUserData() {
    currentUser.value = null;
    usernameController.clear();
    fullnameController.clear();
    fNameController.clear();
    mNameController.clear();
    lNameController.clear();
    emailController.clear();
    phoneController.clear();
  }

  Future<void> loadUserProfile() async {
    try {
      isLoading.value = true;

      // Get user ID from storage (saved during login)
      final userId = box.read('userId');

      if (userId != null) {
        final user = await userDataSource.getUserById(userId);
        currentUser.value = user;

        // Populate form controllers
        usernameController.text = user.username ?? '';
        fullnameController.text = user.fullname ?? '';
        fNameController.text = user.fName ?? '';
        mNameController.text = user.mName ?? '';
        lNameController.text = user.lName ?? '';
        emailController.text = user.email ?? '';
        phoneController.text = user.phoneNumber ?? '';
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to load profile. Please check your connection.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void toggleEdit() {
    isEditing.value = !isEditing.value;
  }

  Future<void> updateProfile() async {
    try {
      isLoading.value = true;

      final userId = box.read('userId');
      if (userId == null) throw Exception('User ID not found');

      final data = {
        'id': userId,
        'username': usernameController.text,
        'fullName': fullnameController.text,
        'fName': fNameController.text,
        'mName': mNameController.text,
        'lName': lNameController.text,
        'email': emailController.text,
        'phoneNumber': phoneController.text,
        'userRoleId': currentUser.value?.userRoleId ?? 2,
        'password': 'Password@123', // TODO: Remove or handle properly
      };

      final updatedUser = await userDataSource.updateUser(userId, data);
      currentUser.value = updatedUser;

      // Update stored username
      box.write('user', updatedUser.username);

      isEditing.value = false;

      Get.snackbar(
        'Success',
        'Profile updated successfully',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green.shade100,
        colorText: Colors.green.shade900,
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to update profile. Please check your connection.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> changePassword() async {
    if (oldPasswordController.text.isEmpty ||
        newPasswordController.text.isEmpty ||
        confirmPasswordController.text.isEmpty) {
      Get.snackbar(
        'Error',
        'Please fill in all password fields',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    if (newPasswordController.text != confirmPasswordController.text) {
      Get.snackbar(
        'Error',
        'New passwords do not match',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    try {
      isLoading.value = true;

      final phoneOrEmail =
          currentUser.value?.email ?? currentUser.value?.phoneNumber ?? '';

      await userDataSource.changePassword(
        phoneOrEmail,
        oldPasswordController.text,
        newPasswordController.text,
      );

      // Clear password fields
      oldPasswordController.clear();
      newPasswordController.clear();
      confirmPasswordController.clear();

      Get.back(); // Close password dialog

      Get.snackbar(
        'Success',
        'Password changed successfully',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green.shade100,
        colorText: Colors.green.shade900,
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to change password. Please check your connection.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade100,
        colorText: Colors.red.shade900,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void showChangePasswordDialog() {
    Get.dialog(
      AlertDialog(
        title: const Text('Change Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: oldPasswordController,
              decoration: const InputDecoration(labelText: 'Current Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: newPasswordController,
              decoration: const InputDecoration(labelText: 'New Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: confirmPasswordController,
              decoration: const InputDecoration(
                labelText: 'Confirm New Password',
              ),
              obscureText: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              oldPasswordController.clear();
              newPasswordController.clear();
              confirmPasswordController.clear();
              Get.back();
            },
            child: const Text('Cancel'),
          ),
          Obx(
            () => ElevatedButton(
              onPressed: isLoading.value ? null : changePassword,
              child: isLoading.value
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Change Password'),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void onClose() {
    usernameController.dispose();
    fullnameController.dispose();
    fNameController.dispose();
    mNameController.dispose();
    lNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    oldPasswordController.dispose();
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
