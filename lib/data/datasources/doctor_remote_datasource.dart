import '../../core/api_client.dart';
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
      final response = await apiClient.get('/MedicalProfessional');

      if (response.hasError) {
        throw Exception('Unable to load doctors');
      }

      final body = response.body;

      if (body is List) {
        final doctors = <MedicalProfessional>[];
        for (int i = 0; i < body.length; i++) {
          try {
            final doctorJson = body[i];
            if (doctorJson != null) {
              final doctor = MedicalProfessional.fromJson(
                Map<String, dynamic>.from(doctorJson as Map),
              );
              doctors.add(doctor);
            }
          } catch (e) {
            // Continue processing other doctors
          }
        }

        return doctors;
      }

      // Defensive fallback in case backend wraps list in an object:
      // e.g. { "data": [...] }
      if (body is Map && body['data'] is List) {
        final List data = body['data'] as List;

        final doctors = <MedicalProfessional>[];
        for (int i = 0; i < data.length; i++) {
          try {
            final doctorJson = data[i];
            if (doctorJson != null) {
              final doctor = MedicalProfessional.fromJson(
                Map<String, dynamic>.from(doctorJson as Map),
              );
              doctors.add(doctor);
            }
          } catch (e) {
            // Continue processing other doctors
          }
        }

        return doctors;
      }

      throw Exception('Unable to load doctors');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<DoctorSchedule>> getDoctorSchedules() async {
    try {
      final response = await apiClient.get('/DoctorSchedule');

      if (response.hasError) {
        throw Exception('Unable to load doctor schedules');
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

      throw Exception('Unable to load doctor schedules');
    } catch (e) {
      rethrow;
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
        throw Exception('Unable to load doctor schedules');
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

      throw Exception('Unable to load doctor schedules');
    } catch (e) {
      rethrow;
    }
  }
}
