import '../datasources/appointment_remote_data_source.dart';
import '../models/appointment_model.dart';
import '../../domain/repositories/appointment_repository.dart';

class AppointmentRepositoryImpl implements AppointmentRepository {
  final AppointmentRemoteDataSource remoteDataSource;

  AppointmentRepositoryImpl({required this.remoteDataSource});

  @override
  Future<AppointmentModel> bookAppointment(AppointmentModel appointment) async {
    return await remoteDataSource.bookAppointment(appointment);
  }

  @override
  Future<List<AppointmentModel>> getAppointments(int userId) async {
    return await remoteDataSource.getAppointmentsByUserId(userId);
  }
}
