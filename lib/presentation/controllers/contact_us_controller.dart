import 'package:get/get.dart';
import '../../data/models/company_setting_model.dart';
import '../../domain/repositories/company_setting_repository.dart';
import '../../core/utils/error_handler.dart';

class ContactUsController extends GetxController {
  final CompanySettingRepository repository;

  ContactUsController(this.repository);

  final Rx<CompanySettingModel?> companySetting = Rx<CompanySettingModel?>(
    null,
  );
  final RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();
    fetchCompanySetting();
  }

  Future<void> fetchCompanySetting() async {
    try {
      isLoading.value = true;
      final setting = await repository.getCompanySetting();
      companySetting.value = setting;
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Load Failed');
    } finally {
      isLoading.value = false;
    }
  }

  void refreshData() {
    fetchCompanySetting();
  }
}
