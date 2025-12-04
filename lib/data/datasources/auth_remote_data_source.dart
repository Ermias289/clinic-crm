
import '../../core/api_client.dart';
import '../models/login_request_model.dart';
import '../models/login_response_model.dart';
import '../models/register_request_model.dart';
import '../models/register_response_model.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponseModel> login(LoginRequestModel request);
  Future<RegisterResponseModel> register(RegisterRequestModel request);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<LoginResponseModel> login(LoginRequestModel request) async {
    final response = await apiClient.post('/api/Auth/login', request.toJson());
    if (response.hasError) {
      throw Exception(response.statusText ?? 'Login failed');
    }
    return LoginResponseModel.fromJson(response.body);
  }

  @override
  Future<RegisterResponseModel> register(RegisterRequestModel request) async {
    final response = await apiClient.post('/api/Auth/register', request.toJson());
    if (response.hasError) {
      throw Exception(response.statusText ?? 'Registration failed');
    }
    return RegisterResponseModel.fromJson(response.body);
  }
}
