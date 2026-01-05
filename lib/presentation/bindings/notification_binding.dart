import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/notification_remote_data_source.dart';
import '../../data/repositories/notification_repository_impl.dart';
import '../../domain/repositories/notification_repository.dart';
import '../controllers/notification_controller.dart';

class NotificationBinding extends Bindings {
  @override
  void dependencies() {
    // Data source
    Get.lazyPut<NotificationRemoteDataSource>(
      () => NotificationRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    // Repository
    Get.lazyPut<NotificationRepository>(
      () => NotificationRepositoryImpl(
        remoteDataSource: Get.find<NotificationRemoteDataSource>(),
      ),
    );

    // Controller
    Get.lazyPut<NotificationController>(
      () => NotificationController(
        repository: Get.find<NotificationRepository>(),
      ),
    );
  }
}
