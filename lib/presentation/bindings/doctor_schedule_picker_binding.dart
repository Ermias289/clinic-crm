import 'package:get/get.dart';

import '../../core/api_client.dart';
import '../../data/datasources/doctor_remote_datasource.dart';
import '../../data/datasources/branch_setting_remote_datasource.dart';
import '../../data/datasources/appointment_remote_data_source.dart';
import '../../data/repositories/doctor_repository_impl.dart';
import '../../data/repositories/branch_setting_repository_impl.dart';
import '../../data/repositories/appointment_repository_impl.dart';
import '../../domain/repositories/branch_setting_repository.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../controllers/doctor_schedule_picker_controller.dart';

class DoctorSchedulePickerBinding extends Bindings {
  @override
  void dependencies() {
    // Remote datasources
    Get.lazyPut<DoctorRemoteDataSource>(
      () => DoctorRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    Get.lazyPut<BranchSettingRemoteDataSource>(
      () => BranchSettingRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    Get.lazyPut<AppointmentRemoteDataSource>(
      () => AppointmentRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    // Repositories
    Get.lazyPut<DoctorRepository>(
      () => DoctorRepositoryImpl(
        remoteDataSource: Get.find<DoctorRemoteDataSource>(),
      ),
    );

    Get.lazyPut<BranchSettingRepository>(
      () => BranchSettingRepositoryImpl(
        remoteDataSource: Get.find<BranchSettingRemoteDataSource>(),
      ),
    );

    Get.lazyPut<AppointmentRepository>(
      () => AppointmentRepositoryImpl(
        remoteDataSource: Get.find<AppointmentRemoteDataSource>(),
      ),
    );

    // Controller
    Get.lazyPut<DoctorSchedulePickerController>(
      () => DoctorSchedulePickerController(
        Get.find<DoctorRepository>(),
        Get.find<BranchSettingRepository>(),
        Get.find<AppointmentRepository>(),
      ),
    );
  }
}
