import '../../core/api_client.dart';
import '../models/branch_setting_model.dart';

abstract class BranchSettingRemoteDataSource {
  Future<List<BranchSettingModel>> getBranchSettings();
}

class BranchSettingRemoteDataSourceImpl implements BranchSettingRemoteDataSource {
  final ApiClient apiClient;

  BranchSettingRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<BranchSettingModel>> getBranchSettings() async {
    try {
      final response = await apiClient.get('/BranchSetting');

      if (response.hasError) {
        throw Exception(
          response.statusText ?? 'Failed to fetch branch settings',
        );
      }

      final body = response.body;

      if (body is List) {
        return body
            .whereType<dynamic>()
            .map(
              (e) =>
                  BranchSettingModel.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      if (body is Map && body['data'] is List) {
        final List data = body['data'] as List;
        return data
            .whereType<dynamic>()
            .map(
              (e) =>
                  BranchSettingModel.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      throw Exception('Unexpected response format for branch settings');
    } catch (e) {
      throw Exception('Error fetching branch settings: $e');
    }
  }
}
