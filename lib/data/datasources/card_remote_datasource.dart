import '../../core/api_client.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';

abstract class CardRemoteDataSource {
  Future<List<CardSettingModel>> getCardSettings();
  Future<bool> requestCard(RequestCardModel request);
}

class CardRemoteDataSourceImpl implements CardRemoteDataSource {
  final ApiClient apiClient;

  CardRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    try {
      final response = await apiClient.get('/api/CardSetting');
      
      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to fetch card settings');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => CardSettingModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error fetching card settings: $e');
    }
  }

  @override
  Future<bool> requestCard(RequestCardModel request) async {
    try {
      final response = await apiClient.post('/api/Card', request.toJson());
      
      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to request card');
      }

      return true;
    } catch (e) {
      throw Exception('Error requesting card: $e');
    }
  }
}
