import '../../core/api_client.dart';
import '../models/appointment_model.dart';

abstract class AppointmentRemoteDataSource {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
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
}