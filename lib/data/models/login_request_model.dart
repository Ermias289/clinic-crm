class LoginRequestModel {
  final String phoneOrEmail;
  final String password;

  LoginRequestModel({required this.phoneOrEmail, required this.password});

  Map<String, dynamic> toJson() {
    return {
      'phoneOrEmail': phoneOrEmail,
      'password': password,
    };
  }
}
