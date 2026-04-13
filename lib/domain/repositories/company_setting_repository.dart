import '../../data/models/company_setting_model.dart';

abstract class CompanySettingRepository {
  Future<CompanySettingModel> getCompanySetting();
}
