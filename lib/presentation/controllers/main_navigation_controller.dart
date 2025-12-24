import 'package:get/get.dart';

class MainNavigationController extends GetxController {
  final currentIndex = 0.obs;

  @override
  void onInit() {
    super.onInit();
    // Check if there's an initial tab argument from login
    final args = Get.arguments as Map<String, dynamic>?;
    if (args != null && args['initialTab'] != null) {
      currentIndex.value = args['initialTab'] as int;
    }
  }

  void changePage(int index) {
    currentIndex.value = index;
  }
}
