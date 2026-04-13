import 'package:get/get.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/datasources/patient_remote_datasource.dart';
import '../../data/datasources/bank_remote_datasource.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../data/repositories/patient_repository_impl.dart';
import '../../data/repositories/bank_repository_impl.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
import '../../core/api_client.dart';
import '../controllers/card_controller.dart';
import '../controllers/profile_controller.dart';

class CardBinding extends Bindings {
  @override
  void dependencies() {
    // User/Profile dependencies (if not already bound)
    if (!Get.isRegistered<UserRemoteDataSource>()) {
      Get.lazyPut(() => UserRemoteDataSource());
    }
    if (!Get.isRegistered<ProfileController>()) {
      Get.lazyPut(() => ProfileController(userDataSource: Get.find()));
    }

    // Card dependencies
    Get.lazyPut<CardRemoteDataSourceImpl>(
      () => CardRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CardRepositoryImpl>(
      () => CardRepositoryImpl(
        remoteDataSource: Get.find<CardRemoteDataSourceImpl>(),
      ),
    );

    // Patient dependencies
    Get.lazyPut<PatientRemoteDataSourceImpl>(
      () => PatientRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<PatientRepositoryImpl>(
      () => PatientRepositoryImpl(
        remoteDataSource: Get.find<PatientRemoteDataSourceImpl>(),
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
        cardRepository: Get.find<CardRepositoryImpl>(),
        patientRepository: Get.find<PatientRepositoryImpl>(),
        getBankDetailsUseCase: Get.find<GetBankDetailsUseCase>(),
      ),
    );
  }
}
