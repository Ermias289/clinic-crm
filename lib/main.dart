
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'config/app_pages.dart';
import 'config/app_routes.dart';
import 'core/theme/app_theme.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  await dotenv.load(fileName: ".env");
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
      getPages: AppPages.routes,
    );
  }
}
