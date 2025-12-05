import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../models/user_model.dart';

class UserRemoteDataSource {
  final ApiClient client = Get.find<ApiClient>();

  Future<List<UserModel>> getAllUsers() async {
    final response = await client.get('/api/User');

    if (response.hasError) {
      throw Exception(response.statusText);
    }

    return (response.body as List)
        .map((e) => UserModel.fromJson(e))
        .toList();
  }

  Future<UserModel> getUserById(int id) async {
    final response = await client.get('/api/User/$id');

    if (response.hasError) {
      throw Exception(response.statusText);
    }

    return UserModel.fromJson(response.body);
  }

  Future<UserModel> updateUser(int id, Map<String, dynamic> data) async {
    final response = await client.put('/api/User/$id', data);

    if (response.hasError) {
      throw Exception(response.statusText);
    }

    return UserModel.fromJson(response.body);
  }

  Future<void> changePassword(String phoneOrEmail, String oldPassword, String newPassword) async {
    final response = await client.post('/api/Auth/changePassword', {
      'phoneOrEmail': phoneOrEmail,
      'password': oldPassword,
      'newPassword': newPassword,
      'reset': false,
    });

    if (response.hasError) {
      throw Exception(response.statusText);
    }
  }
}
