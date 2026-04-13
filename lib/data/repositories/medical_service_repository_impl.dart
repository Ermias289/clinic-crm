import '../datasources/medical_service_remote_datasource.dart';
import '../../domain/models/medical_service_model.dart';

abstract class MedicalServiceRepository {
  Future<List<MedicalService>> getMedicalServices();
}

class MedicalServiceRepositoryImpl implements MedicalServiceRepository {
  final MedicalServiceRemoteDataSource remoteDataSource;

  MedicalServiceRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<MedicalService>> getMedicalServices() async {
    return await remoteDataSource.getMedicalServices();
  }
}
