class RegisterRequestModel {
  final String username;
  final String fullname;
  final String fName;
  final String mName;
  final String lName;
  final String email;
  final String phoneNumber;
  final String password;
  final int userRoleId;

  RegisterRequestModel({
    required this.username,
    required this.fullname,
    required this.fName,
    required this.mName,
    required this.lName,
    required this.email,
    required this.phoneNumber,
    required this.password,
    required this.userRoleId,
  });

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'fullname': fullname,
      'fName': fName,
      'mName': mName,
      'lName': lName,
      'email': email,
      'phoneNumber': phoneNumber,
      'password': password,
      'userRoleId': userRoleId,
    };
  }
}
