import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../controllers/login_controller.dart';
import '../controllers/register_controller.dart';
import '../controllers/dashboard_controller.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ApiClient());
    Get.lazyPut<AuthRemoteDataSource>(() => AuthRemoteDataSourceImpl(apiClient: Get.find()));
    Get.lazyPut<AuthRepository>(() => AuthRepositoryImpl(remoteDataSource: Get.find()));
    Get.lazyPut(() => LoginUseCase(Get.find()));
    Get.lazyPut(() => RegisterUseCase(Get.find()));
    Get.lazyPut(() => LoginController(loginUseCase: Get.find()));
    Get.lazyPut(() => RegisterController(registerUseCase: Get.find()));
    Get.lazyPut(() => DashboardController());
  }
}
