import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../core/api_client.dart';
import '../models/appointment_model.dart';

abstract class AppointmentRemoteDataSource {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
  Future<List<AppointmentModel>> getAppointmentsByPatientId(int id);
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
      print('🔍 Fetching appointments for patient ID: $id (Type: ${id.runtimeType})');
      final url = '/Appointment/bypatientId/$id';
      print('🌐 Requesting: $url');
      final response = await apiClient.get(url);

      if (response.hasError) {
        print('❌ Primary API call failed: ${response.statusCode} - ${response.statusText}');
        print('❌ Response body: ${response.body}');
        
        // Strategy 2: Raw HTTP probe (Bypassing GetConnect)
        print('🔄 Retrying with strategy 2: Raw HTTP Client Probe');
        try {
          final box = GetStorage();
          final token = box.read('token');
          final baseUrl = apiClient.baseUrl; // http://.../api
          
          // Try fetching ALL appointments (since bypatientId is broken)
          final uri = Uri.parse('$baseUrl/Appointment'); 
          print('🌐 Raw Requesting: $uri');
          
          final headers = {
             'Authorization': 'Bearer $token',
             // Intentionally OMITTING content-type: application/json to see if that helps
          };
          
          final rawResponse = await http.get(uri, headers: headers);
          
          print('🛬 Raw Response: ${rawResponse.statusCode}');
          print('🛬 Raw Body: ${rawResponse.body}');
          
          if (rawResponse.statusCode == 200) {
             print('✅ Strategy 2 succeeded (Raw HTTP)');
             final List<dynamic> body = json.decode(rawResponse.body);
             final all = body.map((e) => AppointmentModel.fromJson(e)).toList();
             final filtered = all.where((a) => a.patientId == id).toList();
             print('🔍 Filtered ${all.length} to ${filtered.length} for patient $id');
             return filtered;
          }
        } catch(e) {
           print('❌ Strategy 2 failed: $e');
        }

        throw Exception(
          'Failed to fetch appointments: ${response.statusText} (${response.statusCode})',
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
}
