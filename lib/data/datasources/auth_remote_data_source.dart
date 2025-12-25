import '../../core/api_client.dart';
import '../models/login_request_model.dart';
import '../models/login_response_model.dart';
import '../models/register_request_model.dart';
import '../models/register_response_model.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponseModel> login(LoginRequestModel request);
  Future<RegisterResponseModel> register(RegisterRequestModel request);
  Future<int> getPatientRoleId(); // New method
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<LoginResponseModel> login(LoginRequestModel request) async {
    print('🔐 Attempting login for: ${request.phoneOrEmail}');
    print('🌐 API endpoint: ${apiClient.baseUrl}/Auth/login');

    try {
      final response = await apiClient.post('/Auth/login', request.toJson());
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
      final response = await apiClient.post('/Auth/register', request.toJson());
      print('DEBUG REG: Status ${response.statusCode}, Body: ${response.body}');

      if (response.hasError) {
        String errorMsg = 'Registration failed';
        if (response.body != null && response.body is Map) {
          errorMsg =
              response.body['message'] ?? response.statusText ?? errorMsg;
        } else {
          errorMsg = response.statusText ?? errorMsg;
        }
        throw Exception(errorMsg);
      }
      return RegisterResponseModel.fromJson(response.body);
    } catch (e) {
      throw Exception('Registration error: ${e.toString()}');
    }
  }

  @override
  Future<int> getPatientRoleId() async {
    try {
      final response = await apiClient.get(
        '/UserRole/getRoleByName?Name=Patient',
      );
      if (response.hasError) {
        throw Exception(response.statusText ?? 'Failed to fetch Patient role');
      }
      return response.body['id'];
    } catch (e) {
      print('Error fetching role: $e');
      return 5; // Fallback
    }
  }
}
