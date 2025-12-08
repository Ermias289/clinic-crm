import 'package:get/get.dart';
import 'app_routes.dart';
import '../presentation/bindings/auth_binding.dart';
import '../presentation/bindings/onboarding_binding.dart';
import '../presentation/bindings/main_navigation_binding.dart';
import '../presentation/views/login_view.dart';
import '../presentation/views/register_view.dart';
import '../presentation/views/main_navigation_view.dart';
import '../presentation/views/onboarding_view.dart';
import '../presentation/views/card_selection_view.dart';
import '../presentation/bindings/card_binding.dart';

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
      page: () => const MainNavigationView(),
      binding: MainNavigationBinding(),
    ),
    GetPage(
      name: Routes.CARDS,
      page: () => const CardSelectionView(),
      binding: CardBinding(),
    ),
  ];
}
