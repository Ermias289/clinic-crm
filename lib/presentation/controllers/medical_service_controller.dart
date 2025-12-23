import 'package:get/get.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../config/app_routes.dart';

class MedicalServiceController extends GetxController {
  final MedicalServiceRepository _medicalServiceRepository;

  // CardRepository kept for future use when card checks are re-enabled
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
    // TEMP DEV OVERRIDE:
    // For UI testing we skip card checks and go straight to booking.
    // Restore the original logic when you want to enforce card requirements again.
    Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
  }
}
