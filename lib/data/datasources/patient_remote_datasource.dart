import '../../core/api_client.dart';
import '../models/patient_model.dart';

abstract class PatientRemoteDataSource {
  Future<PatientModel> createPatient(CreatePatientRequest request);
  Future<PatientModel> getPatientById(int id);
  Future<List<PatientModel>> getAllPatients();
  Future<PatientModel> updatePatient(int id, CreatePatientRequest request);
  Future<bool> deletePatient(int id);
}

class PatientRemoteDataSourceImpl implements PatientRemoteDataSource {
  final ApiClient apiClient;

  PatientRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<PatientModel> createPatient(CreatePatientRequest request) async {
    try {
      final response = await apiClient.post('/Patient', request.toJson());

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to create patient');
      }

      return PatientModel.fromJson(response.body as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Error creating patient: $e');
    }
  }

  @override
  Future<PatientModel> getPatientById(int id) async {
    try {
      final response = await apiClient.get('/Patient/$id');

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to get patient');
      }

      return PatientModel.fromJson(response.body as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Error getting patient: $e');
    }
  }

  @override
  Future<List<PatientModel>> getAllPatients() async {
    try {
      final response = await apiClient.get('/Patient');

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to get patients');
      }

      final List<dynamic> data = response.body;
      return data.map((json) => PatientModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error getting patients: $e');
    }
  }

  @override
  Future<PatientModel> updatePatient(
    int id,
    CreatePatientRequest request,
  ) async {
    try {
      final response = await apiClient.put('/Patient/$id', request.toJson());

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to update patient');
      }

      return PatientModel.fromJson(response.body as Map<String, dynamic>);
    } catch (e) {
      throw Exception('Error updating patient: $e');
    }
  }

  @override
  Future<bool> deletePatient(int id) async {
    try {
      final response = await apiClient.delete('/Patient/$id');

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to delete patient');
      }

      return true;
    } catch (e) {
      throw Exception('Error deleting patient: $e');
    }
  }
}
