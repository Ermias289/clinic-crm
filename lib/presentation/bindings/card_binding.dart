import 'package:get/get.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../core/api_client.dart';
import '../controllers/card_controller.dart';

class CardBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CardRemoteDataSourceImpl>(
      () => CardRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CardRepositoryImpl>(
      () => CardRepositoryImpl(remoteDataSource: Get.find<CardRemoteDataSourceImpl>()),
    );
    Get.lazyPut<CardController>(
      () => CardController(repository: Get.find<CardRepositoryImpl>()),
    );
  }
}
