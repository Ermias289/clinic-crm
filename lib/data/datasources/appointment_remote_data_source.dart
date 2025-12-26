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
    final response = await apiClient.get('/Appointment/bypatientId/$id');
    if (response.hasError) {
      throw Exception(response.statusText ?? 'Failed to fetch appointments');
    }
    final List<dynamic> body = response.body;
    return body.map((e) => AppointmentModel.fromJson(e)).toList();
  }
}