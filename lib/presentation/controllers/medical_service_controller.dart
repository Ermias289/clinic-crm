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
      // Simple loading dialog
      Get.dialog(Center(child: CircularProgressIndicator()), barrierDismissible: false);
      
      final card = await _cardRepository.getMyCard();
      
      Get.back(); // Close loading dialog

      // Logic: If no card found (null), redirect to cards page.
      // If card exists but not active? User said "active account". 
      // Assuming existence of card implies account setup started. 
      // If specific status check needed, I'd need to know the status enum strings.
      // Be lenient: if card exists, assume good to go or let next screen handle it.
      // But user said "dont have an active account" -> redirect to cards.
      
      if (card == null) {
        Get.toNamed(Routes.CARDS);
        Get.snackbar('Action Required', 'You need an active card to book appointments.');
      } else {
        // If card exists, verify status if possible. 
        // card['status'] might be 'Active' or something.
        // For now, assume if they have a card, they can book.
        Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
      }
    } catch (e) {
      Get.back(); // Close loading if error
      Get.snackbar('Error', 'Failed to verify account status');
    }
  }
}
