import 'package:get/get.dart';
import '../controllers/payment_controller.dart';
import '../../data/datasources/payment_remote_data_source.dart';
import '../../data/repositories/payment_repository_impl.dart';
import '../../core/api_client.dart';

class PaymentBinding extends Bindings {
  @override
  void dependencies() {
    // Ensure ApiClient is available
    if (!Get.isRegistered<ApiClient>()) {
      Get.lazyPut(() => ApiClient());
    }

    Get.lazyPut<PaymentRemoteDataSourceImpl>(
      () => PaymentRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<PaymentRepositoryImpl>(
      () => PaymentRepositoryImpl(
        remoteDataSource: Get.find<PaymentRemoteDataSourceImpl>(),
      ),
    );
    Get.lazyPut<PaymentController>(
      () => PaymentController(repository: Get.find<PaymentRepositoryImpl>()),
    );
  }
}
