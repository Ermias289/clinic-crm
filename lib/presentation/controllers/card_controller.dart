import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../../data/models/card_setting_model.dart';
import '../../data/models/request_card_model.dart';
import '../../data/models/bank_model.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
import 'package:get_storage/get_storage.dart';
import 'profile_controller.dart';

class CardController extends GetxController {
  final CardRepositoryImpl repository;
  final GetBankDetailsUseCase getBankDetailsUseCase;
  final _box = GetStorage();

  CardController({
    required this.repository,
    required this.getBankDetailsUseCase,
  });

  final RxList<CardSettingModel> cardSettings = <CardSettingModel>[].obs;
  final RxList<Bank> banks = <Bank>[].obs;
  final RxList<BankAccount> bankAccounts = <BankAccount>[].obs;
  final RxBool isLoading = false.obs;
  final RxBool isBankLoading = false.obs;

  // Request Flow State
  final Rx<CardSettingModel?> selectedCard = Rx<CardSettingModel?>(null);

  // Form Controllers
  final TextEditingController fNameController = TextEditingController();
  final TextEditingController mNameController = TextEditingController();
  final TextEditingController lNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController genderController =
      TextEditingController(); // Could be dropdown
  final TextEditingController allergiesController = TextEditingController();
  final TextEditingController chronicConditionsController =
      TextEditingController();
  final TextEditingController emergencyNameController = TextEditingController();
  final TextEditingController emergencyPhoneController =
      TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController subCityController = TextEditingController();
  final TextEditingController countryController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController dobController =
      TextEditingController(); // Date picker handling needed ideally

  final Rx<File?> selectedPaymentProof = Rx<File?>(null);

  // Dependencies
  final ImagePicker _picker = ImagePicker();

  @override
  void onInit() {
    super.onInit();
    fetchCardSettings();
    fetchBankDetails();
  }

  Future<void> fetchCardSettings() async {
    try {
      isLoading.value = true;
      final settings = await repository.getCardSettings();
      cardSettings.assignAll(settings);
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to load card settings: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchBankDetails() async {
    try {
      isBankLoading.value = true;
      final bankList = await getBankDetailsUseCase.getAllBanks();
      banks.assignAll(bankList);

      // Fetch all bank accounts
      final accountList = await getBankDetailsUseCase.getAllBankAccounts();
      bankAccounts.assignAll(accountList);
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to load bank details: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isBankLoading.value = false;
    }
  }

  void startRequest(CardSettingModel cardSetting) {
    selectedCard.value = cardSetting;
    _clearForm();
    _preFillFromProfile();
    Get.toNamed('/request-card-details');
  }

  void validateAndProceed() {
    if (fNameController.text.trim().isEmpty ||
        lNameController.text.trim().isEmpty ||
        phoneController.text.trim().isEmpty ||
        dobController.text.trim().isEmpty) {
      Get.snackbar(
        'Missing Information',
        'Please fill in all required fields (Name, Phone, DOB).',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.redAccent,
        colorText: Colors.white,
      );
      return;
    }

    if (emailController.text.trim().isEmpty ||
        !emailController.text.contains('@')) {
      Get.snackbar(
        'Invalid Email',
        'Please enter a valid email address.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.redAccent,
        colorText: Colors.white,
      );
      return;
    }

    // Add more validation as needed (Email regex, etc.)

    Get.toNamed('/request-card-payment');
  }

  void _clearForm() {
    fNameController.clear();
    mNameController.clear();
    lNameController.clear();
    emailController.clear();
    phoneController.clear();
    genderController.clear();
    allergiesController.clear();
    chronicConditionsController.clear();
    emergencyNameController.clear();
    emergencyPhoneController.clear();
    addressController.clear();
    subCityController.clear();
    countryController.clear();
    cityController.clear();
    dobController.clear();
    selectedPaymentProof.value = null;
  }

  void _preFillFromProfile() {
    try {
      final profileController = Get.find<ProfileController>();
      fNameController.text = profileController.fNameController.text;
      mNameController.text = profileController.mNameController.text;
      lNameController.text = profileController.lNameController.text;
      emailController.text = profileController.emailController.text;
      phoneController.text = profileController.phoneController.text;
    } catch (e) {
      // ProfileController not found or not initialized, skip pre-filling
      print('ProfileController not available for pre-filling: $e');
    }
  }

  Future<void> pickPaymentProof() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        selectedPaymentProof.value = File(image.path);
      }
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to pick image: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  Future<void> submitRequest() async {
    if (selectedPaymentProof.value == null) {
      Get.snackbar(
        'Required',
        'Please upload a payment receipt.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    try {
      isLoading.value = true;
      final patientId =
          _box.read('userId') ?? 0; // Ensure this is valid or handle 0

      // Construct Patient Details
      final patientDetails = PatientDetails(
        fName: fNameController.text,
        mName: mNameController.text,
        lName: lNameController.text,
        email: emailController.text,
        phoneNumber: phoneController.text,
        gender: genderController.text,
        alergies: allergiesController.text,
        chronicConditions: chronicConditionsController.text,
        emergencyContactName: emergencyNameController.text,
        emergencyContactPhone: emergencyPhoneController.text,
        address: addressController.text,
        subCity: subCityController.text,
        country: countryController.text,
        city: cityController.text,
        dateOfBirth: dobController.text, // Ensure correct format YYYY-MM-DD
        requiresUserAccount:
            false, // Defaulting to false for now, or add checkbox
        userId: patientId, // Linking new patient to current user
      );

      final request = RequestCardModel(
        patientId:
            0, // 0 because we are creating a *new* patient via the 'patient' object
        cardTypeId: selectedCard.value?.cardTypeId ?? 0,
        requestRemark: 'Mobile App Request',
        patient: patientDetails,
      );

      // 1. Request Card
      print('DEBUG: Requesting Card...');
      final cardResponse = await repository.requestCard(request);
      // Assuming response contains 'id' of the created card.
      // Need to inspect API response structure. Usually it returns the object.
      // If 'id' key exists.
      final int cardId = cardResponse['id'] ?? 0;

      if (cardId == 0) {
        throw Exception('Failed to retrieve Card ID from response.');
      }
      print('DEBUG: Card Created. ID: $cardId');

      // 2. Create Payment
      print('DEBUG: Creating Payment...');
      await repository.createPayment(cardId, selectedPaymentProof.value!.path);

      // Navigation & Success
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
      Get.snackbar(
        'Error',
        'Failed to submit request: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }
}
