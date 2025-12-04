import '../../data/models/login_request_model.dart';
import '../../data/models/login_response_model.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<LoginResponseModel> call(LoginRequestModel request) async {
    return await repository.login(request);
  }
}
