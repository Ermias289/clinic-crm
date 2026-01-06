import '../datasources/patient_remote_datasource.dart';
import '../models/patient_model.dart';

abstract class PatientRepository {
  Future<PatientModel> createPatient(CreatePatientRequest request);
  Future<PatientModel> getPatientById(int id);
  Future<PatientModel> getPatientByUserId(int userId);
  Future<List<PatientModel>> getAllPatients();
  Future<PatientModel> updatePatient(int id, CreatePatientRequest request);
  Future<bool> deletePatient(int id);
}

class PatientRepositoryImpl implements PatientRepository {
  final PatientRemoteDataSource remoteDataSource;

  PatientRepositoryImpl({required this.remoteDataSource});

  @override
  Future<PatientModel> createPatient(CreatePatientRequest request) async {
    return await remoteDataSource.createPatient(request);
  }

  @override
  Future<PatientModel> getPatientById(int id) async {
    return await remoteDataSource.getPatientById(id);
  }

  @override
  Future<PatientModel> getPatientByUserId(int userId) async {
    return await remoteDataSource.getPatientByUserId(userId);
  }

  @override
  Future<List<PatientModel>> getAllPatients() async {
    return await remoteDataSource.getAllPatients();
  }

  @override
  Future<PatientModel> updatePatient(
    int id,
    CreatePatientRequest request,
  ) async {
    return await remoteDataSource.updatePatient(id, request);
  }

  @override
  Future<bool> deletePatient(int id) async {
    return await remoteDataSource.deletePatient(id);
  }
}
