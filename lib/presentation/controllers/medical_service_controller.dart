import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../config/app_routes.dart';

class MedicalServiceController extends GetxController {
  final MedicalServiceRepository _medicalServiceRepository;

  // CardRepository kept for future use when card checks are re-enabled
  final CardRepository _cardRepository;
  final box = GetStorage();

  MedicalServiceController(
    this._medicalServiceRepository,
    this._cardRepository,
  );

  final services = <MedicalService>[].obs;
  final filteredServices = <MedicalService>[].obs;
  final searchQuery = ''.obs;
  final isLoading = false.obs;
  bool _hasLoadedOnce = false;

  @override
  void onInit() {
    super.onInit();
    // Always check if we should load services on init
    checkAndLoadServices();
  }

  void searchServices(String query) {
    searchQuery.value = query;
    if (query.isEmpty) {
      filteredServices.clear();
    } else {
      filteredServices.value = services
          .where((s) =>
              s.name.toLowerCase().contains(query.toLowerCase()) ||
              (s.description.toLowerCase().contains(query.toLowerCase())))
          .toList();
    }
  }

  // Method to check if services should be loaded and load them if needed
  void checkAndLoadServices() {
    if (_shouldLoadServices()) {
      // Add a small delay to ensure auth token is properly set after login
      Future.delayed(const Duration(milliseconds: 100), () {
        fetchServices();
      });
    }
  }

  bool _shouldLoadServices() {
    final lastLoginTime = box.read('last_login_time') ?? 0;
    final lastServicesLoadTime = box.read('last_services_load_time') ?? 0;

    // Always load if services are empty (this covers the case after login)
    if (services.isEmpty) {
      return true;
    }

    // Load if never loaded before
    if (!_hasLoadedOnce) {
      return true;
    }

    // If login happened after last services load, reload
    if (lastLoginTime > lastServicesLoadTime) {
      return true;
    }

    return false;
  }

  Future<void> fetchServices() async {
    try {
      isLoading.value = true;
      services.value = await _medicalServiceRepository.getMedicalServices();
      _hasLoadedOnce = true;

      // Store the time when services were loaded
      await box.write(
        'last_services_load_time',
        DateTime.now().millisecondsSinceEpoch,
      );
    } catch (e) {
      // If it's a token-related error, retry once after a short delay
      if (e.toString().contains('401') || e.toString().contains('token')) {
        await Future.delayed(const Duration(milliseconds: 500));
        try {
          services.value = await _medicalServiceRepository.getMedicalServices();
          _hasLoadedOnce = true;
          await box.write(
            'last_services_load_time',
            DateTime.now().millisecondsSinceEpoch,
          );
        } catch (retryError) {
          // Final retry failed, we'll let the UI handle the empty state
          // and log a sanitized error internally if needed.
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

  // Method to force refresh (for pull-to-refresh)
  Future<void> refreshServices() async {
    await fetchServices();
  }

  // Method to reset state (for logout)
  void resetState() {
    services.clear();
    _hasLoadedOnce = false;
    isLoading.value = false;
  }
}
