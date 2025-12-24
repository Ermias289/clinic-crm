import 'package:get/get.dart';
import '../../data/models/company_setting_model.dart';
import '../../domain/repositories/company_setting_repository.dart';

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
      Get.snackbar(
        'Error',
        'Failed to load company information: $e',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void refreshData() {
    fetchCompanySetting();
  }
}
