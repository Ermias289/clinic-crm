import '../../data/models/user_model.dart';

abstract class UserRepository {
  Future<List<UserModel>> getAllUsers();
  Future<UserModel> getUserById(int id);
}
