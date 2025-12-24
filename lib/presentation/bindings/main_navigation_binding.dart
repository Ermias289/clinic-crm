import 'package:get/get.dart';
import '../controllers/main_navigation_controller.dart';
import '../controllers/profile_controller.dart';
import '../controllers/contact_us_controller.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../data/datasources/bank_remote_datasource.dart';
import '../../data/datasources/company_setting_remote_datasource.dart';
import '../../data/repositories/bank_repository_impl.dart';
import '../../data/repositories/company_setting_repository_impl.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
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
      () => CardRepositoryImpl(
        remoteDataSource: Get.find<CardRemoteDataSourceImpl>(),
      ),
    );

    // Bank Dependencies
    Get.lazyPut<BankRemoteDataSourceImpl>(
      () => BankRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<BankRepositoryImpl>(
      () => BankRepositoryImpl(
        remoteDataSource: Get.find<BankRemoteDataSourceImpl>(),
      ),
    );
    Get.lazyPut<GetBankDetailsUseCase>(
      () => GetBankDetailsUseCase(Get.find<BankRepositoryImpl>()),
    );

    Get.lazyPut<CardController>(
      () => CardController(
        repository: Get.find<CardRepositoryImpl>(),
        getBankDetailsUseCase: Get.find<GetBankDetailsUseCase>(),
      ),
    );

    // Company Setting Dependencies
    Get.lazyPut<CompanySettingRemoteDataSourceImpl>(
      () =>
          CompanySettingRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CompanySettingRepositoryImpl>(
      () => CompanySettingRepositoryImpl(
        remoteDataSource: Get.find<CompanySettingRemoteDataSourceImpl>(),
      ),
    );
    Get.lazyPut<ContactUsController>(
      () => ContactUsController(Get.find<CompanySettingRepositoryImpl>()),
    );
  }
}
