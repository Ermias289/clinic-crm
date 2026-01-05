import '../../core/api_client.dart';
import '../models/appointment_model.dart';

abstract class AppointmentRemoteDataSource {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
  Future<List<AppointmentModel>> getAppointmentsByPatientId(int id);
  Future<List<AppointmentModel>> getAppointmentsByUserId(int userId);
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
      print(
        '🔍 Fetching appointments for patient ID: $id (Type: ${id.runtimeType})',
      );
      final url = '/Appointment/bypatientId/$id';
      print('🌐 Requesting: $url');
      final response = await apiClient.get(url);

      if (response.hasError) {
        print(
          '❌ Primary API call failed: ${response.statusCode} - ${response.statusText}',
        );
        print('❌ Response body: ${response.body}');

        // Strategy 2: Try standard query parameter pattern
        final url2 = '/Appointment?patientId=$id';
        print('🔄 Retrying with strategy 2: $url2');
        final response2 = await apiClient.get(url2);

        if (!response2.hasError) {
          print('✅ Strategy 2 succeeded');
          final List<dynamic> body = response2.body;
          return body.map((e) => AppointmentModel.fromJson(e)).toList();
        }

        // Strategy 3: Try getting ALL appointments and filtering client-side
        // This is a robust fallback if the specific filter endpoints are broken
        print('🔄 Retrying with strategy 3: Fetch All & Filter');
        final url3 = '/Appointment';
        final response3 = await apiClient.get(url3);

        if (!response3.hasError) {
          print('✅ Strategy 3 succeeded');
          final List<dynamic> body = response3.body;
          final all = body.map((e) => AppointmentModel.fromJson(e)).toList();
          final filtered = all.where((a) => a.patientId == id).toList();
          print(
            '🔍 Filtered ${all.length} appointments to ${filtered.length} for patient $id',
          );
          return filtered;
        }

        throw Exception(
          'Failed to fetch appointments: ${response.statusText} (${response.statusCode}) - Server returned Id validation error on all endpoints.',
        );
      }

      final List<dynamic> body = response.body;
      print('✅ Successfully fetched ${body.length} appointments');
      return body.map((e) => AppointmentModel.fromJson(e)).toList();
    } catch (e) {
      print('❌ Exception in getAppointmentsByPatientId: $e');
      rethrow;
    }
  }

  @override
  Future<List<AppointmentModel>> getAppointmentsByUserId(int userId) async {
    try {
      print('🔍 Fetching appointments for user ID: $userId');
      final url = '/Appointment/byuserId/$userId';
      print('🌐 Requesting: $url');
      final response = await apiClient.get(url);

      if (response.hasError) {
        print(
          '❌ API call failed: ${response.statusCode} - ${response.statusText}',
        );
        throw Exception('Failed to fetch appointments: ${response.statusText}');
      }

      final List<dynamic> body = response.body;
      print(
        '✅ Successfully fetched ${body.length} appointments for user $userId',
      );
      final appointments = body
          .map((e) => AppointmentModel.fromJson(e))
          .toList();

      // Debug: Print parsed appointment details
      for (var appointment in appointments) {
        print('🔍 Parsed appointment:');
        print('  - Service: ${appointment.dentistryService?.name ?? 'NULL'}');
        print(
          '  - Doctor: ${appointment.medicalProfessional?.fName ?? 'NULL'} ${appointment.medicalProfessional?.lName ?? 'NULL'}',
        );
        print('  - Reference: ${appointment.reference ?? 'NULL'}');
      }

      return appointments;
    } catch (e) {
      print('❌ Exception in getAppointmentsByUserId: $e');
      rethrow;
    }
  }
}
