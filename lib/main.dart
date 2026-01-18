import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'config/app_pages.dart';
import 'config/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'core/api_client.dart';
import 'presentation/views/request_card_details_view.dart';
import 'presentation/views/request_card_payment_view.dart';
import 'data/datasources/medical_service_remote_datasource.dart';
import 'data/repositories/medical_service_repository_impl.dart';
import 'data/datasources/card_remote_datasource.dart';
import 'data/repositories/card_repository_impl.dart';
import 'presentation/controllers/medical_service_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  await dotenv.load(fileName: ".env");
  final apiClient = Get.put(ApiClient());

  // Ensure medical services controller & its dependencies are available globally
  final medicalRemote = MedicalServiceRemoteDataSourceImpl(
    apiClient: apiClient,
  );
  final medicalRepo = MedicalServiceRepositoryImpl(
    remoteDataSource: medicalRemote,
  );
  final cardRemote = CardRemoteDataSourceImpl(apiClient: apiClient);
  final cardRepo = CardRepositoryImpl(remoteDataSource: cardRemote);
  Get.put(MedicalServiceController(medicalRepo, cardRepo), permanent: true);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final box = GetStorage();
    final onboardingComplete = box.read('onboarding_complete') ?? false;

    return GetMaterialApp(
      title: 'Clinic CRM',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      initialRoute: onboardingComplete ? Routes.login : Routes.onboarding,
      getPages: [
        ...AppPages.routes,
        GetPage(
          name: '/request-card-details',
          page: () => RequestCardDetailsView(),
        ),
        GetPage(
          name: '/request-card-payment',
          page: () => const RequestCardPaymentView(),
        ),
      ],
    );
  }
}
