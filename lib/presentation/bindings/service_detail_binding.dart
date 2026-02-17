import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/doctor_remote_datasource.dart';
import '../../data/datasources/branch_setting_remote_datasource.dart';
import '../../data/repositories/doctor_repository_impl.dart';
import '../../data/repositories/branch_setting_repository_impl.dart';
import '../../domain/repositories/branch_setting_repository.dart';
import '../controllers/service_detail_controller.dart';

class ServiceDetailBinding extends Bindings {
  @override
  void dependencies() {
    // Doctor Dependencies
    Get.lazyPut<DoctorRemoteDataSource>(
      () => DoctorRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<DoctorRepository>(
      () => DoctorRepositoryImpl(
        remoteDataSource: Get.find<DoctorRemoteDataSource>(),
      ),
    );

    // Branch Dependencies
    Get.lazyPut<BranchSettingRemoteDataSource>(
      () => BranchSettingRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<BranchSettingRepository>(
      () => BranchSettingRepositoryImpl(
        remoteDataSource: Get.find<BranchSettingRemoteDataSource>(),
      ),
    );

    // Controller
    Get.lazyPut<ServiceDetailController>(
      () => ServiceDetailController(
        Get.find<DoctorRepository>(),
        Get.find<BranchSettingRepository>(),
      ),
    );
  }
}
