import 'package:get/get.dart';
import '../controllers/service_detail_controller.dart';

class ServiceDetailBinding extends Bindings {
  @override
  void dependencies() {
    // Controller - no longer needs doctor repository
    Get.lazyPut<ServiceDetailController>(() => ServiceDetailController());
  }
}
