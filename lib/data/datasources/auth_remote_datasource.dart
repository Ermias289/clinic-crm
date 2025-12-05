import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../models/login_request_model.dart';
import '../models/login_response_model.dart';
import '../models/register_request_model.dart';
import '../models/register_response_model.dart';

class AuthRemoteDataSource {
  final ApiClient client = Get.find<ApiClient>();

  Future<LoginResponseModel> login(LoginRequestModel request) async {
    final response = await client.post('/api/Auth/login', request.toJson());

    if (response.hasError) {
      throw Exception(response.statusText);
    }

    return LoginResponseModel.fromJson(response.body);
  }

  Future<RegisterResponseModel> register(RegisterRequestModel request) async {
    final response = await client.post('/api/Auth/register', request.toJson());

    if (response.hasError) {
      throw Exception(response.statusText);
    }

    return RegisterResponseModel.fromJson(response.body);
  }
}
