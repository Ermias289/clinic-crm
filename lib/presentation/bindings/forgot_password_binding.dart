import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../controllers/forgot_password_controller.dart';

class ForgotPasswordBinding extends Bindings {
  @override
  void dependencies() {
    Get.put<ForgotPasswordController>(
      ForgotPasswordController(apiClient: ApiClient()),
      permanent: true,
    );
  }
}
