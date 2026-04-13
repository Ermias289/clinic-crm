import 'package:get/get.dart';
import '../controllers/profile_controller.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../core/api_client.dart';

class ProfileBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ApiClient());
    Get.lazyPut(() => UserRemoteDataSource());
    Get.lazyPut(() => ProfileController(userDataSource: Get.find()));
  }
}
