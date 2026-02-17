import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../../data/models/card_setting_model.dart';
import '../../data/models/card_model.dart';
import '../../data/models/request_card_model.dart';
import '../../data/models/patient_model.dart';
import '../../data/models/payment_model.dart';
import '../../data/models/bank_model.dart';
import '../../data/models/create_payment_request_model.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../data/repositories/patient_repository_impl.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
import '../../config/app_routes.dart';
import '../../core/theme/app_colors.dart';
import 'package:get_storage/get_storage.dart';
import 'profile_controller.dart';

class CardController extends GetxController {
  final CardRepositoryImpl cardRepository;
  final PatientRepositoryImpl patientRepository;
  final GetBankDetailsUseCase getBankDetailsUseCase;
  final _box = GetStorage();

  // Add disposal tracking
  bool _isDisposed = false;

  CardController({
    required this.cardRepository,
    required this.patientRepository,
    required this.getBankDetailsUseCase,
  });

  final RxList<CardSettingModel> cardSettings = <CardSettingModel>[].obs;
  final RxList<Bank> banks = <Bank>[].obs;
  final RxList<BankAccount> bankAccounts = <BankAccount>[].obs;
  final RxBool isLoading = false.obs;
  final RxBool isBankLoading = false.obs;
  final RxBool isCheckingCard = false.obs;
  final Rx<CardModel?> existingCard = Rx<CardModel?>(null);
  final RxBool hasPatientId = false.obs;
  final RxBool isInsuranceCovered = false.obs;

  // Request Flow State
  final Rx<CardSettingModel?> selectedCard = Rx<CardSettingModel?>(null);
  final Rx<PatientModel?> createdPatient = Rx<PatientModel?>(null);
  final Rx<Map<String, dynamic>?> createdCardData = Rx<Map<String, dynamic>?>(
    null,
  );
  final RxList<PaymentModel> cardPayments = <PaymentModel>[].obs;
  final Rx<PaymentModel?> autoPreparedPayment = Rx<PaymentModel?>(null);

  // Form Controllers
  final TextEditingController fNameController = TextEditingController();
  final TextEditingController mNameController = TextEditingController();
  final TextEditingController lNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController genderController = TextEditingController();
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
  final TextEditingController dobController = TextEditingController();
  final TextEditingController requestRemarkController = TextEditingController();

  final Rx<File?> selectedPaymentProof = Rx<File?>(null);

  // Dependencies
  final ImagePicker _picker = ImagePicker();

  @override
  void onClose() {
    // Mark as disposed to prevent further operations
    _isDisposed = true;

    // Dispose all text controllers to prevent memory leaks
    fNameController.dispose();
    mNameController.dispose();
    lNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    genderController.dispose();
    allergiesController.dispose();
    chronicConditionsController.dispose();
    emergencyNameController.dispose();
    emergencyPhoneController.dispose();
    addressController.dispose();
    subCityController.dispose();
    countryController.dispose();
    cityController.dispose();
    dobController.dispose();
    requestRemarkController.dispose();

    super.onClose();
  }

  @override
  void onInit() {
    super.onInit();
    fetchCardSettings();
    fetchBankDetails();
    checkExistingCard();
  }

  Future<void> checkExistingCard() async {
    try {
      if (!_isDisposed) isCheckingCard.value = true;
      final cardData = await cardRepository.getMyCard();

      // Check if disposed during async operation
      if (_isDisposed) return;

      if (cardData != null) {
        existingCard.value = CardModel.fromJson(cardData);
        hasPatientId.value = true;
      } else {
        existingCard.value = null;
        hasPatientId.value = false;
      }
    } catch (e) {
      if (!_isDisposed) {
        existingCard.value = null;
        hasPatientId.value = false;
      }
    } finally {
      // Check if controller was disposed before setting loading state
      if (!_isDisposed) {
        isCheckingCard.value = false;
      }
    }
  }

  bool get isCardExpired {
    if (existingCard.value == null) return false;
    return existingCard.value!.expiredAt != null &&
        existingCard.value!.expiredAt!.isBefore(DateTime.now());
  }

  // Get card status display information
  Map<String, dynamic> get cardStatusInfo {
    if (existingCard.value == null) {
      return {
        'title': 'No Card',
        'message': 'No card found',
        'color': Colors.grey,
        'icon': Icons.credit_card_off,
        'showReactivateButton': false,
      };
    }

    final card = existingCard.value!;
    final status = card.status.toLowerCase();

    switch (status) {
      case 'active':
        return {
          'title': 'Card Active',
          'message': 'Your card is active and ready to use.',
          'color': Colors.green,
          'icon': Icons.check_circle,
          'showReactivateButton': false,
        };
      case 'pending':
        return {
          'title': 'Pending Approval',
          'message':
              'Your card request is pending approval. You will be notified once it\'s approved.',
          'color': Colors.orange,
          'icon': Icons.schedule,
          'showReactivateButton': false,
        };
      case 'expired':
        return {
          'title': 'Card Expired',
          'message':
              'Your card has expired. Please reactivate it to continue using our services.',
          'color': Colors.red,
          'icon': Icons.error,
          'showReactivateButton': true,
        };
      case 'inactive':
        return {
          'title': 'Card Inactive',
          'message':
              'Your card is inactive. Please contact support for assistance.',
          'color': Colors.grey,
          'icon': Icons.block,
          'showReactivateButton': false,
        };
      default:
        return {
          'title': 'Card Status: ${card.status}',
          'message': 'Your card status is ${card.status}.',
          'color': Colors.blue,
          'icon': Icons.info,
          'showReactivateButton': false,
        };
    }
  }

  Future<void> reactivateCard() async {
    if (existingCard.value == null) return;

    try {
      isLoading.value = true;

      // Since auto-prepared payment is created automatically when card expires,
      // we just need to find it and use it for payment submission

      // Step 1: Get payments for the existing expired card
      final payments = await cardRepository.getPaymentsByCardId(
        existingCard.value!.id,
      );
      cardPayments.assignAll(payments);

      // Step 2: Find the auto-prepared payment (created automatically on expiration)
      final foundAutoPreparedPayment = payments
          .where((p) => p.isAutoPrepared)
          .firstOrNull;

      if (foundAutoPreparedPayment == null) {
        throw Exception(
          'No auto-prepared payment found for this expired card. Please contact support.',
        );
      }

      // Step 3: Set up reactivation state with existing card and auto-prepared payment
      autoPreparedPayment.value = foundAutoPreparedPayment;
      selectedPaymentProof.value = null; // Clear any previous proof

      // Step 4: Navigate to reactivation payment view
      Get.toNamed(Routes.CARD_REACTIVATION_PAYMENT);

      Get.snackbar(
        'Payment Required',
        'Complete the payment to reactivate your expired card.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.primaryBlue,
        colorText: Colors.white,
      );
    } catch (e) {
      String errorMessage = 'Failed to find payment for reactivation: $e';

      // Handle specific error cases
      if (e.toString().contains('No auto-prepared payment found')) {
        errorMessage =
            'No payment found for card reactivation. The auto-prepared payment may not have been created yet. Please contact support.';
      }

      Get.snackbar(
        'Error',
        errorMessage,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  /// Complete card reactivation payment (reactivates existing expired card)
  Future<void> submitReactivationPayment() async {
    if (selectedPaymentProof.value == null) {
      Get.snackbar(
        'Required',
        'Please upload a payment receipt.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    if (autoPreparedPayment.value == null) {
      Get.snackbar(
        'Error',
        'No payment found for reactivation.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }

    try {
      isLoading.value = true;

      // Step 1: Upload payment proof
      final uploadedFileName = await cardRepository.uploadPaymentProof(
        selectedPaymentProof.value!.path,
      );

      // Step 2: Create payment request using PUT /api/Payment/paymentRequest
      // This uses the auto-prepared payment that was created when the card expired
      final paymentRequest = CreatePaymentRequest(
        id: autoPreparedPayment.value!.id,
        requestedAmount: autoPreparedPayment.value!.expectedAmount,
        paymentProof: uploadedFileName,
        isInsuranceCovered: isInsuranceCovered.value,
      );

      await cardRepository.createPaymentRequest(paymentRequest);

      // Step 3: Only refresh card data if controller is still active
      if (Get.isRegistered<CardController>()) {
        await checkExistingCard();
      }

      // Step 4: Navigate back to dashboard
      Get.offAllNamed(Routes.DASHBOARD, arguments: {'initialTab': 2});

      Get.snackbar(
        'Reactivation Payment Submitted',
        'Your reactivation payment has been submitted successfully! Your card will be reactivated once the payment is approved.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
        duration: const Duration(seconds: 5),
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to submit reactivation payment: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        duration: const Duration(seconds: 5),
      );
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> fetchCardSettings() async {
    try {
      isLoading.value = true;
      final settings = await cardRepository.getCardSettings();
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

  Future<void> startRequest(CardSettingModel cardSetting) async {
    selectedCard.value = cardSetting;
    _clearForm();
    await _preFillFromProfile();
    Get.toNamed(Routes.REQUEST_CARD_DETAILS);
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

    Get.toNamed(Routes.REQUEST_CARD_PAYMENT);
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
    requestRemarkController.clear();
    selectedPaymentProof.value = null;
    isInsuranceCovered.value = false;
    createdPatient.value = null;
    createdCardData.value = null;
    cardPayments.clear();
    autoPreparedPayment.value = null;
  }

  Future<void> _preFillFromProfile() async {
    try {
      final profileController = Get.find<ProfileController>();

      if (profileController.currentUser.value == null) {
        if (!_isDisposed) isLoading.value = true;
        await profileController.loadUserProfile();

        // Check if controller was disposed during async operation
        if (_isDisposed) return;

        isLoading.value = false;
      }

      // Check if controller was disposed before accessing text controllers
      if (_isDisposed) return;

      fNameController.text = profileController.fNameController.text;
      mNameController.text = profileController.mNameController.text;
      lNameController.text = profileController.lNameController.text;
      emailController.text = profileController.emailController.text;
      phoneController.text = profileController.phoneController.text;
    } catch (e) {
      // ProfileController not found or not initialized, skip pre-filling
      // Also catches any disposal-related errors
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

  /// PM's Specified Flow Implementation
  Future<void> submitCardRequest() async {
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
      final currentUserId = _box.read('userId') ?? 0;

      if (currentUserId == 0) {
        throw Exception('User not logged in');
      }

      // Step 1: Create Patient using POST /api/Patient
      final patientRequest = CreatePatientRequest(
        fName: fNameController.text.trim(),
        mName: mNameController.text.trim(),
        lName: lNameController.text.trim(),
        email: emailController.text.trim(),
        phoneNumber: phoneController.text.trim(),
        gender: genderController.text.trim(),
        alergies: allergiesController.text.trim(),
        chronicConditions: chronicConditionsController.text.trim(),
        emergencyContactName: emergencyNameController.text.trim(),
        emergencyContactPhone: emergencyPhoneController.text.trim(),
        address: addressController.text.trim(),
        subCity: subCityController.text.trim(),
        country: countryController.text.trim(),
        city: cityController.text.trim(),
        dateOfBirth: dobController.text
            .trim(), // Should be in YYYY-MM-DD format
        userId: currentUserId,
        requiresUserAccount: false,
      );

      final patient = await patientRepository.createPatient(patientRequest);
      createdPatient.value = patient;

      // Step 2: Request Card using POST /api/Card
      final cardRequest = RequestCardModel(
        patientId: patient.id,
        cardTypeId: selectedCard.value?.cardTypeId ?? 0,
        requestRemark: requestRemarkController.text.trim().isEmpty
            ? 'Mobile App Request'
            : requestRemarkController.text.trim(),
        patient: PatientDetails(
          fName: patient.fName,
          mName: patient.mName,
          lName: patient.lName,
          email: patient.email,
          phoneNumber: patient.phoneNumber,
          gender: patient.gender,
          alergies: patient.alergies,
          chronicConditions: patient.chronicConditions,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhone: patient.emergencyContactPhone,
          address: patient.address,
          subCity: patient.subCity,
          country: patient.country,
          city: patient.city,
          dateOfBirth: patient.dateOfBirth,
          requiresUserAccount: patient.requiresUserAccount,
          userId: patient.userId,
        ),
      );

      final cardResponse = await cardRepository.requestCard(cardRequest);
      createdCardData.value = cardResponse;
      final cardId = cardResponse['id'] ?? 0;

      if (cardId == 0) {
        throw Exception('Failed to retrieve Card ID from response');
      }

      // Step 3: Get payments by card ID to find auto-prepared payment
      final payments = await cardRepository.getPaymentsByCardId(cardId);
      cardPayments.assignAll(payments);

      // Find the auto-prepared payment (should be only one)
      final autoPrepared = payments.where((p) => p.isAutoPrepared).firstOrNull;

      if (autoPrepared == null) {
        throw Exception('Auto-prepared payment not found');
      }

      autoPreparedPayment.value = autoPrepared;

      // Step 4: Upload payment proof
      final uploadedFileName = await cardRepository.uploadPaymentProof(
        selectedPaymentProof.value!.path,
      );

      // Step 5: Create payment request using PUT /api/Payment/paymentRequest
      final paymentRequest = CreatePaymentRequest(
        id: autoPrepared.id,
        requestedAmount: autoPrepared.expectedAmount,
        paymentProof: uploadedFileName,
        isInsuranceCovered: isInsuranceCovered.value,
      );

      await cardRepository.createPaymentRequest(paymentRequest);

      // Success - Navigate to dashboard (don't refresh card data to avoid disposal issues)
      Get.offAllNamed(Routes.DASHBOARD, arguments: {'initialTab': 2});

      Get.snackbar(
        'Success',
        'Your card request and payment have been submitted successfully! Your card will be activated once the payment is approved.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.green,
        colorText: Colors.white,
        duration: const Duration(seconds: 5),
      );
    } catch (e) {
      Get.snackbar(
        'Error',
        'Failed to submit request: $e',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
        duration: const Duration(seconds: 5),
      );
    } finally {
      isLoading.value = false;
    }
  }
}
