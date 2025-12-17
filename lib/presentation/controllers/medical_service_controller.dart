import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../config/app_routes.dart';

class MedicalServiceController extends GetxController {
  final MedicalServiceRepository _medicalServiceRepository;
  final CardRepository _cardRepository;

  MedicalServiceController(this._medicalServiceRepository, this._cardRepository);

  final services = <MedicalService>[].obs;
  final isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    fetchServices();
  }

  Future<void> fetchServices() async {
    try {
      isLoading.value = true;
      services.value = await _medicalServiceRepository.getMedicalServices();
    } catch (e) {
      // Get.snackbar('Error', 'Failed to load services: $e');
      // Quiet fail or retry? User will see empty list.
      print('Error loading services: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> onServiceSelected(MedicalService service) async {
    try {
      // Show loading indicator
      Get.dialog(
        Center(child: CircularProgressIndicator()),
        barrierDismissible: false,
      );

      try {
        final card = await _cardRepository.getMyCard();
        Get.back(); // Close loading dialog
        
        if (card == null) {
          // No card found, redirect to card setup
          Get.offNamed(Routes.CARDS);
          Get.snackbar(
            'Account Setup Required',
            'Please set up your account card to book appointments.',
            snackPosition: SnackPosition.BOTTOM,
            duration: Duration(seconds: 3),
          );
        } else if (card['status']?.toString().toLowerCase() != 'active') {
          // Card exists but not active
          Get.offNamed(Routes.CARDS);
          Get.snackbar(
            'Account Not Active',
            'Your account card is not yet active. Please complete the setup process.',
            snackPosition: SnackPosition.BOTTOM,
            duration: Duration(seconds: 4),
          );
        } else {
          // Card is active, proceed to booking
          Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
        }
      } catch (e) {
        Get.back(); // Close loading dialog
        if (e.toString().contains('401') || e.toString().contains('unauthorized')) {
          // Session expired or unauthorized
          Get.offAllNamed(Routes.LOGIN);
          Get.snackbar(
            'Session Expired',
            'Please log in again to continue',
            snackPosition: SnackPosition.BOTTOM,
          );
        } else {
          // Other errors
          Get.offNamed(Routes.CARDS);
          Get.snackbar(
            'Account Verification Needed',
            'Please complete your account setup to continue',
            snackPosition: SnackPosition.BOTTOM,
            duration: Duration(seconds: 3),
          );
        }
      }
    } catch (e) {
      Get.back(); // Ensure dialog is closed in case of unexpected errors
      Get.snackbar(
        'Error',
        'An unexpected error occurred. Please try again.',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }
}
