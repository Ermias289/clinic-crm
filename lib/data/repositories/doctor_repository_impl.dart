import '../datasources/doctor_remote_datasource.dart';
import '../../domain/models/medical_professional_model.dart';

abstract class DoctorRepository {
  Future<List<MedicalProfessional>> getDoctors();

  Future<List<DoctorSchedule>> getDoctorSchedules();

  Future<List<DoctorSchedule>> getSchedulesForDoctor(int medicalProfessionalId);

  Future<List<String>> getFreeSlots(int doctorId, int branchId, String date);
}

class DoctorRepositoryImpl implements DoctorRepository {
  final DoctorRemoteDataSource remoteDataSource;

  DoctorRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<MedicalProfessional>> getDoctors() async {
    return await remoteDataSource.getDoctors();
  }

  @override
  Future<List<DoctorSchedule>> getDoctorSchedules() async {
    return await remoteDataSource.getDoctorSchedules();
  }

  @override
  Future<List<DoctorSchedule>> getSchedulesForDoctor(int medicalProfessionalId) async {
    return await remoteDataSource.getSchedulesForDoctor(medicalProfessionalId);
  }

  @override
  Future<List<String>> getFreeSlots(int doctorId, int branchId, String date) async {
    return await remoteDataSource.getFreeSlots(doctorId, branchId, date);
  }
}
