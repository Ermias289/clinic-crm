import '../../domain/repositories/banner_repository.dart';
import '../datasources/banner_remote_datasource.dart';
import '../models/banner_model.dart';

class BannerRepositoryImpl implements BannerRepository {
  final BannerRemoteDataSource remoteDataSource;

  BannerRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<BannerModel>> getAllActiveBanners() async {
    return await remoteDataSource.getAllActiveBanners();
  }
}
