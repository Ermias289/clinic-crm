import 'package:get/get.dart'; // Needed for FormData & MultipartFile
import '../../core/api_client.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';

abstract class CardRemoteDataSource {
  Future<List<CardSettingModel>> getCardSettings();
  Future<Map<String, dynamic>> requestCard(
    RequestCardModel request,
  ); // Changed to return Map (Card object)
  Future<bool> createPayment(int cardId, String proofPath);
  Future<Map<String, dynamic>?> getMyCard();
}

class CardRemoteDataSourceImpl implements CardRemoteDataSource {
  final ApiClient apiClient;

  CardRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    try {
      final response = await apiClient.get('/CardSetting');

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
  Future<Map<String, dynamic>> requestCard(RequestCardModel request) async {
    try {
      print('DEBUG BODY: ${request.toJson()}'); // Debug log
      final response = await apiClient.post('/Card', request.toJson());

      print('DEBUG RESPONSE STATUS: ${response.statusCode}');
      print('DEBUG RESPONSE BODY: ${response.body}');

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to request card');
      }

      return response.body
          as Map<String, dynamic>; // Return the created Card object
    } catch (e) {
      throw Exception('Error requesting card: $e');
    }
  }

  @override
  Future<bool> createPayment(int cardId, String proofPath) async {
    try {
      // 1. Upload the image first
      final form = FormData({
        'file': MultipartFile(proofPath, filename: 'payment_proof.jpg'),
      });

      final uploadResponse = await apiClient.post('/FileUpload/upload', form);

      if (uploadResponse.hasError) {
        throw Exception(
          uploadResponse.statusText ?? 'Failed to upload payment proof',
        );
      }

      final String uploadedFileName = uploadResponse.body['fileName'];

      // 2. Create Payment Request with the uploaded file name
      final body = {
        'cardId': cardId,
        'requestedAmount': 0,
        'paymentProof': uploadedFileName,
      };

      final response = await apiClient.post('/Payment/paymentRequest', body);

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to create payment');
      }
      return true;
    } catch (e) {
      throw Exception('Error creating payment: $e');
    }
  }

  @override
  Future<Map<String, dynamic>?> getMyCard() async {
    try {
      final response = await apiClient.get('/Card/my-card');

      if (response.hasError) {
        if (response.statusCode == 404) {
          return null;
        }
        if (response.statusCode == 401) throw Exception("Unauthorized");

        throw Exception(response.statusText ?? 'Failed to get my card');
      }

      return response.body as Map<String, dynamic>;
    } catch (e) {
      if (e.toString().contains("404")) return null;
      rethrow;
    }
  }
}
