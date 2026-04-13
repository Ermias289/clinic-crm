import 'package:get/get.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../controllers/appointment_detail_controller.dart';

class AppointmentDetailBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<AppointmentDetailController>(
      () => AppointmentDetailController(
        repository: Get.find<AppointmentRepository>(),
      ),
    );
  }
}
