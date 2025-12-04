import 'package:get/get.dart';
import 'app_routes.dart';
import '../presentation/bindings/auth_binding.dart';
import '../presentation/views/login_view.dart';
import '../presentation/views/register_view.dart';
import '../presentation/views/dashboard_view.dart';

class AppPages {
  static const INITIAL = Routes.LOGIN;

  static final routes = [
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
  ];
}
