import '../../data/models/appointment_model.dart';

abstract class AppointmentRepository {
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment);
  Future<List<AppointmentModel>> getAppointments(int userId);
}
