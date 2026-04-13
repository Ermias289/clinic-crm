import 'package:get/get.dart';
import '../controllers/about_us_controller.dart';

class AboutUsBinding extends Bindings {
  @override
  void dependencies() {
    // Controller
    Get.lazyPut<AboutUsController>(() => AboutUsController());
  }
}
