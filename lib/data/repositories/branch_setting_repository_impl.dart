import '../../domain/repositories/branch_setting_repository.dart';
import '../datasources/branch_setting_remote_datasource.dart';
import '../models/branch_setting_model.dart';

class BranchSettingRepositoryImpl implements BranchSettingRepository {
  final BranchSettingRemoteDataSource remoteDataSource;

  BranchSettingRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<BranchSettingModel>> getBranchSettings() async {
    return await remoteDataSource.getBranchSettings();
  }
}
