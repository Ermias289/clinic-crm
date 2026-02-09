import '../../data/models/appointment_model.dart';

abstract class AppointmentRepository {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
  Future<List<AppointmentModel>> getAppointmentsByPatientId(int id);
  Future<List<AppointmentModel>> getAppointmentsByUserId(int userId);
  Future<List<AppointmentModel>> getAppointmentsByDoctorId(int doctorId);
  Future<bool> cancelAppointment(int id, String reason);
  Future<List<String>> getFreeSlots(int docId, String date, int branchId, int serviceId);
}
