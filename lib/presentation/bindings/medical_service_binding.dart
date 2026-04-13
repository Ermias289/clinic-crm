import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/medical_service_remote_datasource.dart';
import '../../data/repositories/medical_service_repository_impl.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../controllers/medical_service_controller.dart';

class MedicalServiceBinding extends Bindings {
  @override
  void dependencies() {
    // Medical Service Dependencies
    Get.lazyPut<MedicalServiceRemoteDataSource>(
      () => MedicalServiceRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<MedicalServiceRepository>(
      () => MedicalServiceRepositoryImpl(remoteDataSource: Get.find<MedicalServiceRemoteDataSource>()),
    );

    // Card Dependencies (if not already bound, better safe)
    Get.lazyPut<CardRemoteDataSource>(
      () => CardRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CardRepository>(
      () => CardRepositoryImpl(remoteDataSource: Get.find<CardRemoteDataSource>()),
    );

    Get.lazyPut<MedicalServiceController>(
      () => MedicalServiceController(
        Get.find<MedicalServiceRepository>(),
        Get.find<CardRepository>(),
      ),
    );
  }
}
