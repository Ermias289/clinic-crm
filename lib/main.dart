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


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  await dotenv.load(fileName: ".env");
  Get.put(ApiClient());
  
  
  // Debug logging
  print('📱 App starting...');
  print('🔧 API_BASE_URL: ${dotenv.env['API_BASE_URL']}');
  
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
      initialRoute: onboardingComplete ? Routes.LOGIN : Routes.ONBOARDING,
      getPages: [
        ...AppPages.routes,
        GetPage(
          name: '/request-card-details',
          page: () => const RequestCardDetailsView(),
        ),
        GetPage(
          name: '/request-card-payment',
          page: () => const RequestCardPaymentView(),
        ),
      ],
    );
  }
}


