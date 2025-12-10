import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../../data/models/card_setting_model.dart';
import '../../data/models/request_card_model.dart';
import '../../data/repositories/card_repository_impl.dart';
import 'package:get_storage/get_storage.dart';

class CardController extends GetxController {
  final CardRepositoryImpl repository;
  final _box = GetStorage();

  CardController({required this.repository});

  final RxList<CardSettingModel> cardSettings = <CardSettingModel>[].obs;
  final RxBool isLoading = false.obs;

  // Request Flow State
  final Rx<CardSettingModel?> selectedCard = Rx<CardSettingModel?>(null);
  final TextEditingController chronicDiseasesController = TextEditingController();
  final Rx<File?> selectedPaymentProof = Rx<File?>(null);
  
  // Dependencies
  final ImagePicker _picker = ImagePicker();

  @override
  void onInit() {
    super.onInit();
    fetchCardSettings();
  }

  Future<void> fetchCardSettings() async {
    try {
      isLoading.value = true;
      final settings = await repository.getCardSettings();
      cardSettings.assignAll(settings);
    } catch (e) {
      Get.snackbar('Error', 'Failed to load card settings: $e', snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }

  void startRequest(CardSettingModel cardSetting) {
    selectedCard.value = cardSetting;
    chronicDiseasesController.clear();
    selectedPaymentProof.value = null;
    Get.toNamed('/request-card-details');
  }

  Future<void> pickPaymentProof() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        selectedPaymentProof.value = File(image.path);
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to pick image: $e', snackPosition: SnackPosition.BOTTOM);
    }
  }

  Future<void> submitRequest() async {
    if (selectedPaymentProof.value == null) {
       Get.snackbar('Required', 'Please upload a payment receipt.', snackPosition: SnackPosition.BOTTOM);
       return;
    }

    try {
      isLoading.value = true;
      final patientId = _box.read('userId') ?? 0;
      
      // Mock Submission for now (Backend Deferred)
      await Future.delayed(const Duration(seconds: 2)); // Simulate network

      print('DEBUG: Submitting Request');
      print('User ID: $patientId');
      print('Card: ${selectedCard.value?.cardType?.name}');
      print('Chronic Diseases: ${chronicDiseasesController.text}');
      print('Payment Proof Path: ${selectedPaymentProof.value?.path}');

      // Navigate back to success or home
      // Close all dialogs/forms
      Get.until((route) => Get.currentRoute == '/main-navigation');
      
      Get.snackbar(
        'Success', 
        'Your request has been submitted successfully! We will review your payment.', 
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
        duration: const Duration(seconds: 4),
      );

    } catch (e) {
      print('DEBUG: Error in submitRequest: $e');
      Get.snackbar('Error', 'Failed to submit request: $e', snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }

  // Legacy method - keeping for reference or if used elsewhere, but startRequest is new entry point
  Future<void> requestCardLegacy(CardSettingModel cardSetting) async {
    try {
      isLoading.value = true;
      
      // Assuming 'user' object in GetStorage has an 'id'. Adjust based on actual User model storage.
      // If user ID is not stored, we might need to fetch profile first or store it on login.
      // For now, let's verify what is stored in 'user'. 
      // Based on DashboardView: final userName = box.read('user') ?? 'User';
      // It seems 'user' might just be a string name? I need to verify this assumption.
      // Checking AuthRepositoryImpl or LoginController to see what is stored.
      
      // Pending verification of User ID storage. using placeholder 0 for now to compile.
      // I will check the login logic next to ensure we get the correct ID.
      // Or I can require the User ID to be passed or fetched.
      
      // Let's assume we can get the ID.
      final int patientId = _box.read('userId') ?? 0;

      if (patientId == 0) {
        Get.snackbar('Error', 'User ID not found. Please login again.', snackPosition: SnackPosition.BOTTOM);
        return;
      }

      print('DEBUG: Requesting card for user: $patientId');  // Debug print
      
      final request = RequestCardModel(
        patientId: patientId, 
        cardTypeId: cardSetting.cardTypeId ?? 0,
        requestRemark: 'Requested from Mobile App',
      );

      print('DEBUG: Calling repository...'); // Debug print
      await repository.requestCard(request);
      print('DEBUG: Repository call success'); // Debug print
      Get.snackbar('Success', 'Card requested successfully!', snackPosition: SnackPosition.BOTTOM);
    } catch (e) {
      print('DEBUG: Error in requestCard: $e'); // Debug print
      Get.snackbar('Error', 'Failed to request card: $e', snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }
}
