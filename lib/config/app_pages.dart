import 'package:get/get.dart';
import 'app_routes.dart';
import '../presentation/bindings/auth_binding.dart';
import '../presentation/bindings/onboarding_binding.dart';
import '../presentation/bindings/profile_binding.dart';
import '../presentation/views/login_view.dart';
import '../presentation/views/register_view.dart';
import '../presentation/views/dashboard_view.dart';
import '../presentation/views/onboarding_view.dart';
import '../presentation/views/profile_view.dart';

class AppPages {
  static const INITIAL = Routes.ONBOARDING;

  static final routes = [
    GetPage(
      name: Routes.ONBOARDING,
      page: () => const OnboardingView(),
      binding: OnboardingBinding(),
    ),
    GetPage(
      name: Routes.LOGIN,
      page: () => const LoginView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.REGISTER,
      page: () => const RegisterView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.DASHBOARD,
      page: () => const DashboardView(),
    ),
    GetPage(
      name: Routes.PROFILE,
      page: () => const ProfileView(),
      binding: ProfileBinding(),
    ),
  ];
}
