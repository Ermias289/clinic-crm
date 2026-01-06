import 'dart:io';
import 'package:get/get.dart'; // Needed for FormData & MultipartFile
import '../../core/api_client.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';
import '../models/payment_model.dart';
import '../models/create_payment_request_model.dart';

abstract class CardRemoteDataSource {
  Future<List<CardSettingModel>> getCardSettings();
  Future<Map<String, dynamic>> requestCard(
    RequestCardModel request,
  ); // Changed to return Map (Card object)
  Future<List<PaymentModel>> getPaymentsByCardId(int cardId);
  Future<PaymentModel> createPaymentRequest(CreatePaymentRequest request);
  Future<Map<String, dynamic>?> getMyCard();
  Future<String> uploadPaymentProof(
    String imagePath,
  ); // New method for just uploading image
}

class CardRemoteDataSourceImpl implements CardRemoteDataSource {
  final ApiClient apiClient;

  CardRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    try {
      final response = await apiClient.get('/CardSetting');

      if (response.hasError) {
        print('❌ Error Body: ${response.bodyString}');
        throw Exception('${response.statusText ?? 'Failed to fetch card settings'} - ${response.bodyString}');
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
      final response = await apiClient.post('/Card', request.toJson());

      if (response.hasError) {
        print('❌ Error Body: ${response.bodyString}');
        throw Exception('${response.statusText ?? 'Failed to request card'} - ${response.bodyString}');
      }

      return response.body
          as Map<String, dynamic>; // Return the created Card object
    } catch (e) {
      throw Exception('Error requesting card: $e');
    }
  }

  @override
  Future<List<PaymentModel>> getPaymentsByCardId(int cardId) async {
    try {
      final response = await apiClient.get('/Payment/bycardId$cardId');

      if (response.hasError) {
        // Handle 404 as empty list (no payments found)
        if (response.statusCode == 404) {
          return [];
        }
        print('❌ Error Body: ${response.bodyString}');
        throw Exception('${response.statusText ?? 'Failed to fetch payments'} - ${response.bodyString}');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => PaymentModel.fromJson(json)).toList();
    } catch (e) {
      // Handle 404 errors as empty list
      if (e.toString().contains('404') || e.toString().contains('Not Found')) {
        return [];
      }
      throw Exception('Error fetching payments: $e');
    }
  }

  @override
  Future<PaymentModel> createPaymentRequest(
    CreatePaymentRequest request,
  ) async {
    try {
      final response = await apiClient.put(
        '/Payment/paymentRequest',
        request.toJson(),
      );

      if (response.hasError) {
        throw Exception(
          '${response.statusText ?? 'Failed to create payment request'} - ${response.bodyString}',
        );
      }

      return PaymentModel.fromJson(response.body as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Error creating payment request: $e');
    }
  }

  @override
  Future<String> uploadPaymentProof(String imagePath) async {
    try {
      // Check file size: 2MB limit
      final file = File(imagePath);
      final int fileSize = await file.length();
      const int maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (fileSize > maxSize) {
        throw Exception(
          'Payment proof file size exceeds the maximum allowed limit of 2MB.',
        );
      }

      // Upload the image
      final form = FormData({
        'file': MultipartFile(imagePath, filename: 'payment_proof.jpg'),
      });

      final uploadResponse = await apiClient.post('/FileUpload/upload', form);

      if (uploadResponse.hasError) {
        throw Exception(
          '${uploadResponse.statusText ?? 'Failed to upload payment proof'} - ${uploadResponse.bodyString}',
        );
      }

      final String uploadedFileName = uploadResponse.body['fileName'];

      return uploadedFileName;
    } catch (e) {
      throw Exception('Error uploading payment proof: $e');
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

        throw Exception('${response.statusText ?? 'Failed to get my card'} - ${response.bodyString}');
      }

      return response.body as Map<String, dynamic>;
    } catch (e) {
      if (e.toString().contains("404")) return null;
      rethrow;
    }
  }
}
