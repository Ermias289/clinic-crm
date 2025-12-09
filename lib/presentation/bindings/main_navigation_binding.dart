import 'package:get/get.dart';
import '../controllers/main_navigation_controller.dart';
import '../controllers/profile_controller.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../core/api_client.dart';
import '../controllers/card_controller.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';

class MainNavigationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => MainNavigationController());
    Get.lazyPut(() => ApiClient());
    Get.lazyPut(() => UserRemoteDataSource());
    Get.lazyPut(() => ProfileController(userDataSource: Get.find()));

    // Card Dependencies
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
