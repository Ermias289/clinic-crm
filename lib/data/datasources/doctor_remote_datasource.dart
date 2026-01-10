import '../../core/api_client.dart';
import '../../core/network_helper.dart';
import '../../domain/models/medical_professional_model.dart';

/// Remote datasource for:
/// - Doctors (Medical Professionals): GET `/MedicalProfessional`
/// - Doctor schedules: GET `/DoctorSchedule`
///
/// Notes:
/// - This file assumes your app uses the existing `ApiClient` wrapper (GetX-style)
///   already used by other datasources (e.g. medical services).
/// - The backend authorization is expected to be handled by `ApiClient` (token header).
abstract class DoctorRemoteDataSource {
  Future<List<MedicalProfessional>> getDoctors();

  /// Fetch all schedules (backend currently exposes a general list endpoint).
  /// Filter on the client for a specific doctor.
  Future<List<DoctorSchedule>> getDoctorSchedules();

  /// Convenience helper: fetch schedules and filter by doctor id.
  Future<List<DoctorSchedule>> getSchedulesForDoctor(int medicalProfessionalId);
}

class DoctorRemoteDataSourceImpl implements DoctorRemoteDataSource {
  final ApiClient apiClient;

  DoctorRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<MedicalProfessional>> getDoctors() async {
    try {
      print('🔍 Fetching doctors from API...');
      final response = await apiClient.get('/MedicalProfessional');

      print('📊 Doctor API Response Status: ${response.statusCode}');
      print('📊 Doctor API Response Body Type: ${response.body.runtimeType}');

      if (response.hasError) {
        print('❌ Doctor API Error: ${response.statusText}');
        throw Exception(response.statusText ?? 'Failed to fetch doctors');
      }

      final body = response.body;
      print('📊 Processing doctor response body...');

      if (body is List) {
        print('📊 Found ${body.length} doctors in response');

        final doctors = <MedicalProfessional>[];
        for (int i = 0; i < body.length; i++) {
          try {
            final doctorJson = body[i];
            if (doctorJson != null) {
              final doctor = MedicalProfessional.fromJson(
                Map<String, dynamic>.from(doctorJson as Map),
              );
              doctors.add(doctor);
              print(
                '✅ Parsed doctor ${i + 1}: ${doctor.fullName} (ID: ${doctor.id})',
              );
            } else {
              print('⚠️ Skipping null doctor at index $i');
            }
          } catch (e) {
            print('❌ Error parsing doctor at index $i: $e');
            // Continue processing other doctors
          }
        }

        print('✅ Successfully parsed ${doctors.length} doctors');
        return doctors;
      }

      // Defensive fallback in case backend wraps list in an object:
      // e.g. { "data": [...] }
      if (body is Map && body['data'] is List) {
        final List data = body['data'] as List;
        print('📊 Found wrapped data with ${data.length} doctors');

        final doctors = <MedicalProfessional>[];
        for (int i = 0; i < data.length; i++) {
          try {
            final doctorJson = data[i];
            if (doctorJson != null) {
              final doctor = MedicalProfessional.fromJson(
                Map<String, dynamic>.from(doctorJson as Map),
              );
              doctors.add(doctor);
              print(
                '✅ Parsed wrapped doctor ${i + 1}: ${doctor.fullName} (ID: ${doctor.id})',
              );
            } else {
              print('⚠️ Skipping null doctor at index $i in wrapped data');
            }
          } catch (e) {
            print('❌ Error parsing wrapped doctor at index $i: $e');
            // Continue processing other doctors
          }
        }

        print('✅ Successfully parsed ${doctors.length} wrapped doctors');
        return doctors;
      }

      print('❌ Unexpected response format for doctors: ${body.runtimeType}');
      throw Exception('Unexpected response format for doctors');
    } catch (e) {
      print('❌ Exception in getDoctors: $e');
      throw Exception('Error fetching doctors: $e');
    }
  }

  @override
  Future<List<DoctorSchedule>> getDoctorSchedules() async {
    try {
      final response = await apiClient.get('/DoctorSchedule');

      if (response.hasError) {
        throw Exception(
          response.statusText ?? 'Failed to fetch doctor schedules',
        );
      }

      final body = response.body;

      if (body is List) {
        return body
            .whereType<dynamic>()
            .map(
              (e) =>
                  DoctorSchedule.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      // Defensive fallback in case backend wraps list in an object:
      if (body is Map && body['data'] is List) {
        final List data = body['data'] as List;
        return data
            .whereType<dynamic>()
            .map(
              (e) =>
                  DoctorSchedule.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      throw Exception('Unexpected response format for doctor schedules');
    } catch (e) {
      throw Exception('Error fetching doctor schedules: $e');
    }
  }

  @override
  Future<List<DoctorSchedule>> getSchedulesForDoctor(
    int medicalProfessionalId,
  ) async {
    try {
      final response = await apiClient.get(
        '/DoctorSchedule?medicalProfessionalId=$medicalProfessionalId',
      );

      if (response.hasError) {
        throw Exception(
          response.statusText ?? 'Failed to fetch doctor schedules',
        );
      }

      final body = response.body;

      if (body is List) {
        return body
            .whereType<dynamic>()
            .map(
              (e) =>
                  DoctorSchedule.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      // Defensive fallback in case backend wraps list in an object:
      if (body is Map && body['data'] is List) {
        final List data = body['data'] as List;
        return data
            .whereType<dynamic>()
            .map(
              (e) =>
                  DoctorSchedule.fromJson(Map<String, dynamic>.from(e as Map)),
            )
            .toList();
      }

      throw Exception('Unexpected response format for doctor schedules');
    } catch (e) {
      throw Exception('Error fetching doctor schedules for doctor: $e');
    }
  }
}
