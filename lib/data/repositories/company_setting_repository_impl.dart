import '../datasources/company_setting_remote_datasource.dart';
import '../models/company_setting_model.dart';
import '../../domain/repositories/company_setting_repository.dart';

class CompanySettingRepositoryImpl implements CompanySettingRepository {
  final CompanySettingRemoteDataSource remoteDataSource;

  CompanySettingRepositoryImpl({required this.remoteDataSource});

  @override
  Future<CompanySettingModel> getCompanySetting() async {
    return await remoteDataSource.getCompanySetting();
  }
}
