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
import '../presentation/views/services_list_view.dart';
import '../presentation/views/service_detail_view.dart';
import '../presentation/views/appointment_booking_view.dart';
import '../presentation/bindings/medical_service_binding.dart';
import '../presentation/bindings/service_detail_binding.dart';
import '../presentation/views/otp_verification_view.dart';
import '../presentation/bindings/otp_verification_binding.dart';
import '../presentation/views/forgot_password_view.dart';
import '../presentation/bindings/forgot_password_binding.dart';
import '../presentation/views/reset_password_view.dart';
import '../presentation/bindings/reset_password_binding.dart';
import '../presentation/views/doctor_schedule_picker_view.dart';
import '../presentation/bindings/doctor_schedule_picker_binding.dart';

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
      page: () => RegisterView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.FORGOT_PASSWORD,
      page: () => const ForgotPasswordView(),
      binding: ForgotPasswordBinding(),
    ),
    GetPage(
      name: Routes.RESET_PASSWORD,
      page: () => const ResetPasswordView(),
      binding: ResetPasswordBinding(),
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
    GetPage(
      name: Routes.SERVICES,
      page: () => ServicesListView(),
      binding: MedicalServiceBinding(),
    ),
    GetPage(
      name: Routes.SERVICE_DETAIL,
      page: () => const ServiceDetailView(),
      binding: ServiceDetailBinding(),
    ),
    GetPage(
      name: Routes.BOOK_APPOINTMENT,
      page: () => const AppointmentBookingView(),
    ),
    GetPage(
      name: Routes.DOCTOR_SCHEDULE_PICKER,
      page: () => const DoctorSchedulePickerView(),
      binding: DoctorSchedulePickerBinding(),
    ),
    GetPage(
      name: Routes.OTP_VERIFICATION,
      page: () => const OTPVerificationView(),
      binding: OTPVerificationBinding(),
    ),
  ];
}
