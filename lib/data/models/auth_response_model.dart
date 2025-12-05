import 'user_model.dart';

class AuthResponseModel {
  final String? token;
  final UserModel? user;
  // We can add UserRole model if needed, but for now we might just need the token and user info.
  // Based on API ref: "userRole": { ... }

  AuthResponseModel({
    this.token,
    this.user,
  });

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseModel(
      token: json['token'],
      user: json['user'] != null ? UserModel.fromJson(json['user']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'user': user?.toJson(),
    };
  }
}
