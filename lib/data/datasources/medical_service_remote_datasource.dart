import '../../core/api_client.dart';
import '../../domain/models/medical_service_model.dart';

abstract class MedicalServiceRemoteDataSource {
  Future<List<MedicalService>> getMedicalServices();
}

class MedicalServiceRemoteDataSourceImpl
    implements MedicalServiceRemoteDataSource {
  final ApiClient apiClient;

  MedicalServiceRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<MedicalService>> getMedicalServices() async {
    try {
      final response = await apiClient.get('/MedicalService');

      if (response.hasError) {
        throw Exception('Unable to load medical services');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => MedicalService.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }
}
