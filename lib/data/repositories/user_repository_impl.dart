import '../../domain/repositories/user_repository.dart';
import '../../data/datasources/user_remote_datasource.dart';
import '../../data/models/user_model.dart';

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;

  UserRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<UserModel>> getAllUsers() async {
    return await remoteDataSource.getAllUsers();
  }

  @override
  Future<UserModel> getUserById(int id) async {
    return await remoteDataSource.getUserById(id);
  }

  @override
  Future<UserModel> updateUser(int id, Map<String, dynamic> data) async {
    return await remoteDataSource.updateUser(id, data);
  }
  @override
  Future<void> deleteUser(int id) async {
    return await remoteDataSource.deleteUser(id);
  }
}
