import '../../core/api_client.dart';
import '../models/payment_model.dart';

abstract class PaymentRemoteDataSource {
  Future<List<PaymentModel>> getPaymentsByPatientId(int patientId);
}

class PaymentRemoteDataSourceImpl implements PaymentRemoteDataSource {
  final ApiClient apiClient;

  PaymentRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<PaymentModel>> getPaymentsByPatientId(int patientId) async {
    try {
      print('🔍 Fetching payments for patient ID: $patientId');
      final url = '/Payment/bypatientId$patientId';
      print('🌐 Requesting: $url');

      final response = await apiClient.get(url);

      if (response.hasError) {
        print('❌ Payment API Error: ${response.statusText}');
        throw Exception(response.statusText ?? 'Failed to fetch payments');
      }

      print('✅ Payment API Success: ${response.body.length} payments found');

      final List<dynamic> paymentsJson = response.body;
      return paymentsJson.map((json) => PaymentModel.fromJson(json)).toList();
    } catch (e) {
      print('❌ Payment fetch error: $e');
      throw Exception('Failed to fetch payment history: $e');
    }
  }
}
