import '../../core/api_client.dart';
import '../../domain/models/medical_service_model.dart';

abstract class MedicalServiceRemoteDataSource {
  Future<List<MedicalService>> getMedicalServices();
}

class MedicalServiceRemoteDataSourceImpl implements MedicalServiceRemoteDataSource {
  final ApiClient apiClient;

  MedicalServiceRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<MedicalService>> getMedicalServices() async {
    try {
      final response = await apiClient.get('/api/MedicalService');
      
      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to fetch medical services');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => MedicalService.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error fetching medical services: $e');
    }
  }
}
