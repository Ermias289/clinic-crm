import 'package:get/get.dart';

import '../../core/api_client.dart';
import '../../data/datasources/doctor_remote_datasource.dart';
import '../../data/repositories/doctor_repository_impl.dart';
import '../controllers/doctor_schedule_picker_controller.dart';

class DoctorSchedulePickerBinding extends Bindings {
  @override
  void dependencies() {
    // Remote datasource
    Get.lazyPut<DoctorRemoteDataSource>(
      () => DoctorRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    // Repository
    Get.lazyPut<DoctorRepository>(
      () => DoctorRepositoryImpl(remoteDataSource: Get.find<DoctorRemoteDataSource>()),
    );

    // Controller
    Get.lazyPut<DoctorSchedulePickerController>(
      () => DoctorSchedulePickerController(Get.find<DoctorRepository>()),
    );
  }
}
