import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/models/login_request_model.dart';
import '../../data/models/login_response_model.dart';
import '../../data/models/register_request_model.dart';
import '../../data/models/register_response_model.dart';
import '../../domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl({required this.remoteDataSource});

  @override
  Future<LoginResponseModel> login(LoginRequestModel request) async {
    return await remoteDataSource.login(request);
  }

  @override
  Future<RegisterResponseModel> register(RegisterRequestModel request) async {
    return await remoteDataSource.register(request);
  }
}
