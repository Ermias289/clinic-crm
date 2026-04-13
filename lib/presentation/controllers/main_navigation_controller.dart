import 'package:get/get.dart';
import 'medical_service_controller.dart';

class MainNavigationController extends GetxController {
  final currentIndex = 0.obs;

  @override
  void onInit() {
    super.onInit();
    // Check if there's an initial tab argument from login
    final args = Get.arguments as Map<String, dynamic>?;
    if (args != null && args['initialTab'] != null) {
      currentIndex.value = args['initialTab'] as int;
      // If navigating to services tab after login, ensure services are loaded
      if (currentIndex.value == 2) {
        _triggerServicesLoad();
      }
    }
  }

  void changePage(int index) {
    currentIndex.value = index;
    // If switching to services tab, check if services need to be loaded
    if (index == 2) {
      _triggerServicesLoad();
    }
  }

  void _triggerServicesLoad() {
    // Trigger services load if controller exists
    Future.delayed(const Duration(milliseconds: 50), () {
      if (Get.isRegistered<MedicalServiceController>()) {
        Get.find<MedicalServiceController>().checkAndLoadServices();
      }
    });
  }
}
