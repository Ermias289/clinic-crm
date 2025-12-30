import 'package:get/get.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../config/app_routes.dart';

class MedicalServiceController extends GetxController {
  final MedicalServiceRepository _medicalServiceRepository;

  // CardRepository kept for future use when card checks are re-enabled
  final CardRepository _cardRepository;

  MedicalServiceController(
    this._medicalServiceRepository,
    this._cardRepository,
  );

  final services = <MedicalService>[].obs;
  final isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    // Add a small delay to ensure auth token is properly set after login
    Future.delayed(const Duration(milliseconds: 100), () {
      fetchServices();
    });
  }

  Future<void> fetchServices() async {
    try {
      isLoading.value = true;
      services.value = await _medicalServiceRepository.getMedicalServices();
    } catch (e) {
      print('Error loading services: $e');
      // If it's a token-related error, retry once after a short delay
      if (e.toString().contains('401') || e.toString().contains('token')) {
        print('Retrying services fetch due to auth issue...');
        await Future.delayed(const Duration(milliseconds: 500));
        try {
          services.value = await _medicalServiceRepository.getMedicalServices();
        } catch (retryError) {
          print('Retry failed: $retryError');
        }
      }
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> onServiceSelected(MedicalService service) async {
    // Navigate to service detail page instead of directly to booking
    Get.toNamed(Routes.SERVICE_DETAIL, arguments: service);
  }
}
