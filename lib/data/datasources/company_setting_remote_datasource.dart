import '../../core/api_client.dart';
import '../models/company_setting_model.dart';

abstract class CompanySettingRemoteDataSource {
  Future<CompanySettingModel> getCompanySetting();
}

class CompanySettingRemoteDataSourceImpl
    implements CompanySettingRemoteDataSource {
  final ApiClient apiClient;

  CompanySettingRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<CompanySettingModel> getCompanySetting() async {
    try {
      final response = await apiClient.get('/CompanySetting');

      if (response.hasError) {
        throw Exception('Unable to load company settings');
      }

      return CompanySettingModel.fromJson(response.body);
    } catch (e) {
      rethrow;
    }
  }
}
