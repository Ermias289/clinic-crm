import 'package:get/get.dart';
import '../controllers/main_navigation_controller.dart';
import '../controllers/profile_controller.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../core/api_client.dart';

class MainNavigationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => MainNavigationController());
    Get.lazyPut(() => ApiClient());
    Get.lazyPut(() => UserRemoteDataSource());
    Get.lazyPut(() => ProfileController(userDataSource: Get.find()));
  }
}
