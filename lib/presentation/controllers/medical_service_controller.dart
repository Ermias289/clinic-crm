import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter/foundation.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../config/app_routes.dart';
import '../../core/utils/error_handler.dart';

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

      // Apply current search if any
      if (searchQuery.value.isNotEmpty) {
        searchServices(searchQuery.value);
      }
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

          // Apply current search if any
          if (searchQuery.value.isNotEmpty) {
            searchServices(searchQuery.value);
          }
        } catch (retryError) {
          // Retry failed
          debugPrint('Retry fetchServices failed: $retryError');
          // Only show error if we have no services to show
          if (services.isEmpty) {
             ErrorHandler.handleError(retryError, customTitle: 'Failed to load services');
          }
        }
      } else {
         // Handle other errors
         if (services.isEmpty) {
            ErrorHandler.handleError(e, customTitle: 'Failed to load services');
         } else {
            debugPrint('Background fetchServices failed: $e');
         }
      }
    } finally {
      isLoading.value = false;
    }
  }

  void searchServices(String query) {
    searchQuery.value = query;

    if (query.isEmpty) {
      filteredServices.clear();
      return;
    }

    final lowercaseQuery = query.toLowerCase();
    filteredServices.value = services.where((service) {
      return service.name.toLowerCase().contains(lowercaseQuery) ||
          service.description.toLowerCase().contains(lowercaseQuery);
    }).toList();
  }

  Future<void> onServiceSelected(MedicalService service) async {
    // Navigate to service detail page instead of directly to booking
    Get.toNamed(Routes.serviceDetail, arguments: service);
  }

  void onQuickAppointment() {
    // Navigate to doctor schedule picker for quick appointment
    // This allows users to select any service during the booking process
    Get.toNamed(Routes.doctorSchedulePicker);
  }

  // Method to force refresh (for pull-to-refresh)
  Future<void> refreshServices() async {
    await fetchServices();
  }

  // Method to reset state (for logout)
  void resetState() {
    services.clear();
    filteredServices.clear();
    searchQuery.value = '';
    _hasLoadedOnce = false;
    isLoading.value = false;
  }
}
