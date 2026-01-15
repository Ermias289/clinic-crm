import '../../core/api_client.dart';
import '../models/appointment_model.dart';

abstract class AppointmentRemoteDataSource {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
  Future<List<AppointmentModel>> getAppointmentsByPatientId(int id);
  Future<List<AppointmentModel>> getAppointmentsByUserId(int userId);
  Future<List<AppointmentModel>> getAppointmentsByDoctorId(int doctorId);
  Future<bool> cancelAppointment(int id, String reason);
}

class AppointmentRemoteDataSourceImpl implements AppointmentRemoteDataSource {
  final ApiClient apiClient;

  AppointmentRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment) async {
    final response = await apiClient.post('/Appointment', appointment.toJson());
    if (response.hasError) {
      throw Exception(response.statusText ?? 'Failed to book appointment');
    }
    return AppointmentModel(
      dentistryId: response.body['dentistryId'],
      medicalProfessionalId: response.body['medicalProfessionalId'],
      patientId: response.body['patientId'],
      branchId: response.body['branchId'],
      reservationTime: response.body['reservationTime'],
      day: response.body['day'],
      paymentProof: response.body['paymentProof'],
    );
  }

  @override
  Future<List<AppointmentModel>> getAppointmentsByPatientId(int id) async {
    try {
      final url = '/Appointment/bypatientId/$id';
      final response = await apiClient.get(url);

      if (response.hasError) {
        // Strategy 2: Try standard query parameter pattern
        final url2 = '/Appointment?patientId=$id';
        final response2 = await apiClient.get(url2);

        if (!response2.hasError) {
          final List<dynamic> body = response2.body;
          return body.map((e) => AppointmentModel.fromJson(e)).toList();
        }

        // Strategy 3: Try getting ALL appointments and filtering client-side
        // This is a robust fallback if the specific filter endpoints are broken
        final url3 = '/Appointment';
        final response3 = await apiClient.get(url3);

        if (!response3.hasError) {
          final List<dynamic> body = response3.body;
          final all = body.map((e) => AppointmentModel.fromJson(e)).toList();
          final filtered = all.where((a) => a.patientId == id).toList();
          
          return filtered;
        }

        throw Exception(
          'Failed to fetch appointments: ${response.statusText} (${response.statusCode}) - Server returned Id validation error on all endpoints.',
        );
      }

      final List<dynamic> body = response.body;
      return body.map((e) => AppointmentModel.fromJson(e)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<AppointmentModel>> getAppointmentsByUserId(int userId) async {
    try {
      final url = '/Appointment/byuserId/$userId';
      final response = await apiClient.get(url);

      if (response.hasError) {
        throw Exception('Failed to fetch appointments: ${response.statusText}');
      }

      final List<dynamic> body = response.body;
      final appointments = body
          .map((e) => AppointmentModel.fromJson(e))
          .toList();

      return appointments;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<AppointmentModel>> getAppointmentsByDoctorId(int doctorId) async {
    try {
      final url = '/Appointment/bydocId/$doctorId';
      final response = await apiClient.get(url);

      if (response.hasError) {
        // Fallback: Try query parameter approach
        final url2 = '/Appointment?medicalProfessionalId=$doctorId';
        final response2 = await apiClient.get(url2);

        if (!response2.hasError) {
          final List<dynamic> body = response2.body;
          return body.map((e) => AppointmentModel.fromJson(e)).toList();
        }

        // Final fallback: Get all and filter
        final url3 = '/Appointment';
        final response3 = await apiClient.get(url3);

        if (!response3.hasError) {
          final List<dynamic> body = response3.body;
          final all = body.map((e) => AppointmentModel.fromJson(e)).toList();
          final filtered = all
              .where((a) => a.medicalProfessionalId == doctorId)
              .toList();

          return filtered;
        }

        throw Exception(
          'Failed to fetch appointments for doctor: ${response.statusText}',
        );
      }

      final List<dynamic> body = response.body;
      return body.map((e) => AppointmentModel.fromJson(e)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<bool> cancelAppointment(int id, String reason) async {
    try {
      final url =
          '/Appointment/cancelAppointment?Id=$id&reason=${Uri.encodeComponent(reason)}';
      final response = await apiClient.put(url, {});

      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to cancel appointment');
      }

      return true;
    } catch (e) {
      rethrow;
    }
  }
}
