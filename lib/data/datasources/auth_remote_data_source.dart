
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
    print('🔐 Attempting login for: ${request.phoneOrEmail}');
    print('🌐 API endpoint: ${apiClient.baseUrl}/api/Auth/login');
    
    try {
      final response = await apiClient.post('/api/Auth/login', request.toJson());
      print('📡 Response status: ${response.statusCode}');
      print('📡 Response hasError: ${response.hasError}');
      
      if (response.hasError) {
        print('❌ Login error: ${response.statusText}');
        throw Exception(response.statusText ?? 'Login failed');
      }
      
      print('✅ Login successful');
      return LoginResponseModel.fromJson(response.body);
    } catch (e) {
      print('💥 Login exception: $e');
      rethrow;
    }
  }

  @override
  Future<RegisterResponseModel> register(RegisterRequestModel request) async {
    try {
      final response = await apiClient.post('/api/Auth/register-patient', request.toJson());
      if (response.hasError) {
        throw Exception(response.body['message'] ?? response.statusText ?? 'Registration failed');
      }
      return RegisterResponseModel.fromJson(response.body);
    } catch (e) {
      throw Exception('Registration error: ${e.toString()}');
    }
  }
}
