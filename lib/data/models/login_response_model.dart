import 'user_model.dart';

class LoginResponseModel {
  final String token;
  final UserRoleModel userRole;
  final UserModel user;

  LoginResponseModel({
    required this.token,
    required this.userRole,
    required this.user,
  });

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      token: json['token'],
      userRole: UserRoleModel.fromJson(json['userRole']),
      user: UserModel.fromJson(json['user']),
    );
  }
}

class UserRoleModel {
  final int id;
  final String roleName;
  final bool isAdmin;

  UserRoleModel({required this.id, required this.roleName, required this.isAdmin});

  factory UserRoleModel.fromJson(Map<String, dynamic> json) {
    return UserRoleModel(
      id: json['id'],
      roleName: json['roleName'],
      isAdmin: json['isAdmin'] ?? false,
    );
  }
}

