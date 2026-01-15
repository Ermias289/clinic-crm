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
      final url = '/Payment/bypatientId/$patientId';

      final response = await apiClient.get(url);

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to fetch payments');
      }


      final List<dynamic> paymentsJson = response.body;
      return paymentsJson.map((json) => PaymentModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch payment history: $e');
    }
  }
}
