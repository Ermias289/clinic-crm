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
      
      // Print all data received from backend
      print('\n' + '='*80);
      print('📞 CONTACT US PAGE - BACKEND DATA');
      print('='*80);
      
      if (setting != null) {
        print('\n🏢 COMPANY INFORMATION:');
        print('  • ID: ${setting.id}');
        print('  • Name: ${setting.name}');
        print('  • Prefix: ${setting.prefix}');
        print('  • Logo URL: ${setting.logo}');
        
        print('\n📧 CONTACT DETAILS:');
        print('  • Email: ${setting.email}');
        print('  • Phone Number: ${setting.phoneNumber}');
        print('  • Emergency Phone: ${setting.emergencyPhoneNumber}');
        
        print('\n📍 ADDRESS INFORMATION:');
        print('  • Address: ${setting.address}');
        print('  • City: ${setting.city}');
        print('  • Sub City: ${setting.subCity}');
        print('  • Country: ${setting.country}');
        print('  • Location on Map: ${setting.locationOnMap}');
        
        print('\n🏢 BRANCHES:');
        if (setting.branches != null && setting.branches!.isNotEmpty) {
          print('  • Total Branches: ${setting.branches!.length}');
          for (var i = 0; i < setting.branches!.length; i++) {
            final branch = setting.branches![i];
            print('  \n  Branch ${i + 1}:');
            print('    - Name: ${branch.name}');
            print('    - Phone: ${branch.phoneNumber}');
            print('    - Address: ${branch.address}');
            print('    - City: ${branch.city}');
          }
        } else {
          print('  • No branches available');
        }
        
        print('\n⏰ WORKING DAYS:');
        if (setting.workdays != null && setting.workdays!.isNotEmpty) {
          print('  • Total Working Days: ${setting.workdays!.length}');
          for (var workday in setting.workdays!) {
            print('  • ${workday.day}: ${workday.openingTime ?? "Closed"} - ${workday.closingTime ?? "Closed"} ${workday.isWorkingDay == true ? "(Open)" : "(Closed)"}');
          }
        } else {
          print('  • No working days information available');
        }
        
        print('\n📅 TIMESTAMPS:');
        print('  • Created At: ${setting.createdAt}');
        print('  • Updated At: ${setting.updatedAt}');
        
        print('\n📦 RAW JSON DATA:');
        print(setting.toJson());
      } else {
        print('\n⚠️  No company setting data received from backend');
      }
      
      print('\n' + '='*80 + '\n');
    } catch (e) {
      print('\n❌ ERROR fetching company setting: $e\n');
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
