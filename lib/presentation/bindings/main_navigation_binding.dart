import 'package:get/get.dart';
import '../controllers/main_navigation_controller.dart';
import '../controllers/profile_controller.dart';
import '../controllers/contact_us_controller.dart';
import '../controllers/notification_controller.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../data/datasources/bank_remote_datasource.dart';
import '../../data/datasources/company_setting_remote_datasource.dart';
import '../../data/datasources/notification_remote_data_source.dart';
import '../../data/repositories/bank_repository_impl.dart';
import '../../data/repositories/company_setting_repository_impl.dart';
import '../../data/repositories/notification_repository_impl.dart';
import '../../domain/repositories/notification_repository.dart';
import '../../domain/usecases/get_bank_details_usecase.dart';
import '../../core/api_client.dart';
import '../controllers/card_controller.dart';
import '../../data/datasources/card_remote_datasource.dart';
import '../../data/datasources/patient_remote_datasource.dart';
import '../../data/repositories/card_repository_impl.dart';
import '../../data/repositories/patient_repository_impl.dart';
import '../controllers/appointment_controller.dart';
import '../../data/datasources/appointment_remote_data_source.dart';
import '../../data/repositories/appointment_repository_impl.dart';
import '../../core/services/appointment_event_service.dart';

class MainNavigationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => MainNavigationController());
    Get.lazyPut(() => ApiClient());
    Get.lazyPut(() => UserRemoteDataSource());
    Get.lazyPut(() => ProfileController(userDataSource: Get.find()));

    // Core Services
    Get.put(AppointmentEventService(), permanent: true);

    // Card Dependencies
    Get.lazyPut<CardRemoteDataSourceImpl>(
      () => CardRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<CardRepositoryImpl>(
      () => CardRepositoryImpl(
        remoteDataSource: Get.find<CardRemoteDataSourceImpl>(),
      ),
    );

    // Patient Dependencies
    Get.lazyPut<PatientRemoteDataSourceImpl>(
      () => PatientRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<PatientRepositoryImpl>(
      () => PatientRepositoryImpl(
        remoteDataSource: Get.find<PatientRemoteDataSourceImpl>(),
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
        cardRepository: Get.find<CardRepositoryImpl>(),
        patientRepository: Get.find<PatientRepositoryImpl>(),
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

    // Appointment Dependencies
    Get.lazyPut<AppointmentRemoteDataSourceImpl>(
      () => AppointmentRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<AppointmentRepositoryImpl>(
      () => AppointmentRepositoryImpl(
        remoteDataSource: Get.find<AppointmentRemoteDataSourceImpl>(),
      ),
    );
    Get.lazyPut<AppointmentController>(
      () => AppointmentController(
        repository: Get.find<AppointmentRepositoryImpl>(),
      ),
    );

    // Notification Dependencies
    Get.lazyPut<NotificationRemoteDataSource>(
      () => NotificationRemoteDataSourceImpl(apiClient: Get.find<ApiClient>()),
    );
    Get.lazyPut<NotificationRepository>(
      () => NotificationRepositoryImpl(
        remoteDataSource: Get.find<NotificationRemoteDataSource>(),
      ),
    );
    Get.lazyPut<NotificationController>(
      () => NotificationController(
        repository: Get.find<NotificationRepository>(),
      ),
    );
  }
}
