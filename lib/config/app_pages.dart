import 'package:get/get.dart';
import 'app_routes.dart';
import '../presentation/bindings/auth_binding.dart';
import '../presentation/bindings/onboarding_binding.dart';
import '../presentation/bindings/main_navigation_binding.dart';
import '../presentation/bindings/notification_binding.dart';
import '../presentation/views/login_view.dart';
import '../presentation/views/register_view.dart';
import '../presentation/views/main_navigation_view.dart';
import '../presentation/views/onboarding_view.dart';
import '../presentation/views/card_selection_view.dart';
import '../presentation/views/notifications_view.dart';
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
import '../presentation/views/request_card_details_view.dart';
import '../presentation/views/request_card_payment_view.dart';
import '../presentation/views/card_reactivation_payment_view.dart';
import '../presentation/views/payment_history_view.dart';
import '../presentation/bindings/payment_binding.dart';
import '../presentation/views/appointment_detail_view.dart';
import '../presentation/bindings/appointment_detail_binding.dart';
import '../presentation/views/about_us_view.dart';
import '../presentation/bindings/about_us_binding.dart';

class AppPages {
  static const initial = Routes.onboarding;

  static final routes = [
    GetPage(
      name: Routes.onboarding,
      page: () => const OnboardingView(),
      binding: OnboardingBinding(),
    ),
    GetPage(
      name: Routes.login,
      page: () => const LoginView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.register,
      page: () => RegisterView(),
      binding: AuthBinding(),
    ),
    GetPage(
      name: Routes.forgotPassword,
      page: () => const ForgotPasswordView(),
      binding: ForgotPasswordBinding(),
    ),
    GetPage(
      name: Routes.resetPassword,
      page: () => const ResetPasswordView(),
      binding: ResetPasswordBinding(),
    ),
    GetPage(
      name: Routes.dashboard,
      page: () => const MainNavigationView(),
      binding: MainNavigationBinding(),
    ),
    GetPage(
      name: Routes.cards,
      page: () => const CardSelectionView(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.requestCardDetails,
      page: () => RequestCardDetailsView(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.requestCardPayment,
      page: () => const RequestCardPaymentView(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.cardReactivationPayment,
      page: () => const CardReactivationPaymentView(),
      binding: CardBinding(),
    ),
    GetPage(
      name: Routes.services,
      page: () => ServicesListView(),
      binding: MedicalServiceBinding(),
    ),
    GetPage(
      name: Routes.serviceDetail,
      page: () => const ServiceDetailView(),
      binding: ServiceDetailBinding(),
    ),
    GetPage(
      name: Routes.bookAppointment,
      page: () => const AppointmentBookingView(),
    ),
    GetPage(
      name: Routes.doctorSchedulePicker,
      page: () => const DoctorSchedulePickerView(),
      binding: DoctorSchedulePickerBinding(),
    ),
    GetPage(
      name: Routes.otpVerification,
      page: () => const OTPVerificationView(),
      binding: OTPVerificationBinding(),
    ),
    GetPage(
      name: Routes.notifications,
      page: () => const NotificationsView(),
      binding: NotificationBinding(),
    ),
    GetPage(
      name: Routes.paymentHistory,
      page: () => const PaymentHistoryView(),
      binding: PaymentBinding(),
    ),
    GetPage(
      name: Routes.appointmentDetails,
      page: () => const AppointmentDetailView(),
      binding: AppointmentDetailBinding(),
    ),
    GetPage(
      name: Routes.aboutUs,
      page: () => const AboutUsView(),
      binding: AboutUsBinding(),
    ),
  ];
}
