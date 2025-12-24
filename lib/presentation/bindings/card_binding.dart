import 'package:get/get.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/datasources/bank_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../data/repositories/bank_repository_impl.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
import '../../core/api_client.dart';
import '../controllers/card_controller.dart';

class CardBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<CardRemoteDataSourceImpl>(
      () => CardRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CardRepositoryImpl>(
      () => CardRepositoryImpl(
        remoteDataSource: Get.find<CardRemoteDataSourceImpl>(),
      ),
    );

    // Bank dependencies
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
  }
}
