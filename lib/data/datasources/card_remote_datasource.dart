import 'dart:io';
import 'package:get/get.dart'; // Needed for FormData & MultipartFile
import 'package:get_storage/get_storage.dart';
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
  Future<void> reactivateCard(int cardId);
}

class CardRemoteDataSourceImpl implements CardRemoteDataSource {
  final ApiClient apiClient;

  CardRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    try {
      final response = await apiClient.get('/CardSetting');

      if (response.hasError) {
        throw Exception('Unable to load card settings');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => CardSettingModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Map<String, dynamic>> requestCard(RequestCardModel request) async {
    try {
      final response = await apiClient.post('/Card', request.toJson());

      if (response.hasError) {
        throw Exception('Unable to request card');
      }

      return response.body
          as Map<String, dynamic>; // Return the created Card object
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<PaymentModel>> getPaymentsByCardId(int cardId) async {
    try {
      final response = await apiClient.get('/Payment/bycardId/$cardId');

      if (response.hasError) {
        // Handle 404 as empty list (no payments found)
        if (response.statusCode == 404) {
          return [];
        }
        throw Exception('Unable to load payments');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => PaymentModel.fromJson(json)).toList();
    } catch (e) {
      // Handle 404 errors as empty list
      if (e.toString().contains('404') || e.toString().contains('Not Found')) {
        return [];
      }
      rethrow;
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
        throw Exception('Unable to create payment request');
      }

      return PaymentModel.fromJson(response.body as Map<String, dynamic>);
    } catch (e) {
      rethrow;
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
        throw Exception('Unable to upload payment proof');
      }

      final String uploadedFileName = uploadResponse.body['fileName'];

      return uploadedFileName;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Map<String, dynamic>?> getMyCard() async {
    try {
      // Get current user ID from storage
      final _box = GetStorage();
      final currentUserId = _box.read('userId') ?? 0;

      if (currentUserId == 0) {
        throw Exception('Please login to continue');
      }

      final response = await apiClient.get('/Card/cardByUserId/$currentUserId');

      if (response.hasError) {
        if (response.statusCode == 404) {
          return null;
        }
        if (response.statusCode == 401) throw Exception("Unauthorized");

        throw Exception('Unable to load card information');
      }

      return response.body as Map<String, dynamic>;
    } catch (e) {
      if (e.toString().contains("404")) return null;
      rethrow;
    }
  }

  @override
  Future<void> reactivateCard(int cardId) async {
    try {
      final response = await apiClient.put('/Card/$cardId', {});

      if (response.hasError) {
        // Extract error message from response body if available
        String errorMessage = 'Unable to reactivate card';

        if (response.body != null && response.body is Map) {
          final body = response.body as Map<String, dynamic>;
          if (body.containsKey('message')) {
            errorMessage = body['message'];
          }
        }

        throw Exception(errorMessage);
      }
    } catch (e) {
      // Re-throw the exception to preserve the original error message
      if (e is Exception) {
        rethrow;
      }
      rethrow;
    }
  }
}
