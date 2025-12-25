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
        throw Exception(
          response.statusText ?? 'Failed to fetch company settings',
        );
      }

      return CompanySettingModel.fromJson(response.body);
    } catch (e) {
      throw Exception('Error fetching company settings: $e');
    }
  }
}
