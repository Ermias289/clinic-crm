import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class DashboardController extends GetxController {
  final currentIndex = 0.obs;
  final box = GetStorage();

  void changePage(int index) {
    currentIndex.value = index;
  }

  void logout() {
    box.remove('token');
    box.remove('user');
    Get.offAllNamed('/login');
  }
}
