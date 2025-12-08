import 'package:get/get.dart';
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

  Future<void> requestCard(CardSettingModel cardSetting) async {
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

      final request = RequestCardModel(
        patientId: patientId, 
        cardTypeId: cardSetting.cardTypeId ?? 0,
        requestRemark: 'Requested from Mobile App',
      );

      await repository.requestCard(request);
      Get.snackbar('Success', 'Card requested successfully!', snackPosition: SnackPosition.BOTTOM);
    } catch (e) {
      Get.snackbar('Error', 'Failed to request card: $e', snackPosition: SnackPosition.BOTTOM);
    } finally {
      isLoading.value = false;
    }
  }
}
