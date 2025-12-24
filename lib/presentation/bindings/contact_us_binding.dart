import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../data/datasources/company_setting_remote_datasource.dart';
import '../../data/repositories/company_setting_repository_impl.dart';
import '../controllers/contact_us_controller.dart';

class ContactUsBinding extends Bindings {
  @override
  void dependencies() {
    // Data sources
    Get.lazyPut<CompanySettingRemoteDataSource>(
      () =>
          CompanySettingRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );

    // Repositories
    Get.lazyPut<CompanySettingRepositoryImpl>(
      () => CompanySettingRepositoryImpl(
        remoteDataSource: Get.find<CompanySettingRemoteDataSource>(),
      ),
    );

    // Controller
    Get.lazyPut<ContactUsController>(
      () => ContactUsController(Get.find<CompanySettingRepositoryImpl>()),
    );
  }
}
