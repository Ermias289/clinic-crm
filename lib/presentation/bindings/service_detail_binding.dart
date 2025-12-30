import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/doctor_remote_datasource.dart';
import '../../data/repositories/doctor_repository_impl.dart';
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

    // Controller
    Get.lazyPut<ServiceDetailController>(
      () => ServiceDetailController(Get.find<DoctorRepository>()),
    );
  }
}
