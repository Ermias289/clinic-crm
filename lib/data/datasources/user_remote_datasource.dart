import 'package:get/get.dart';
import '../../core/api_client.dart';
import '../../core/utils/error_handler.dart';
import '../models/user_model.dart';

class UserRemoteDataSource {
  final ApiClient client = Get.find<ApiClient>();

  Future<List<UserModel>> getAllUsers() async {
    final response = await client.get('/User');

    if (response.hasError) {
      final errorMsg = ErrorHandler.extractErrorMessage(
        response,
        fallback: 'Failed to fetch users',
      );
      throw Exception(errorMsg);
    }

    return (response.body as List).map((e) => UserModel.fromJson(e)).toList();
  }

  Future<UserModel> getUserById(int id) async {
    final response = await client.get('/User/$id');

    if (response.hasError) {
      final errorMsg = ErrorHandler.extractErrorMessage(
        response,
        fallback: 'Failed to fetch user',
      );
      throw Exception(errorMsg);
    }

    return UserModel.fromJson(response.body);
  }

  Future<UserModel> updateUser(int id, Map<String, dynamic> data) async {
    final response = await client.put('/User/$id', data);

    if (response.hasError) {
      final errorMsg = ErrorHandler.extractErrorMessage(
        response,
        fallback: 'Failed to update user',
      );
      throw Exception(errorMsg);
    }

    return UserModel.fromJson(response.body);
  }

  Future<void> changePassword(
    String phoneOrEmail,
    String oldPassword,
    String newPassword,
  ) async {
    final response = await client.post('/Auth/changePassword', {
      'phoneOrEmail': phoneOrEmail,
      'password': oldPassword,
      'newPassword': newPassword,
      'reset': false,
    });

    if (response.hasError) {
      final errorMsg = ErrorHandler.extractErrorMessage(
        response,
        fallback: 'Failed to change password',
      );
      throw Exception(errorMsg);
    }
  }

  Future<void> deleteUser(int id) async {
    final response = await client.delete('/User/$id');

    if (response.hasError) {
      final errorMsg = ErrorHandler.extractErrorMessage(
        response,
        fallback: 'Failed to delete account',
      );
      throw Exception(errorMsg);
    }
  }
}
