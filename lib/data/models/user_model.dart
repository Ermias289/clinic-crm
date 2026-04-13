class UserModel {
  final int? id;
  final String? username;
  final String? fullname;
  final String? fName;
  final String? mName;
  final String? lName;
  final String? email;
  final String? phoneNumber;
  final String? roleName;
  final int? userRoleId;

  UserModel({
    this.id,
    this.username,
    this.fullname,
    this.fName,
    this.mName,
    this.lName,
    this.email,
    this.phoneNumber,
    this.roleName,
    this.userRoleId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'],
      fullname: json['fullname'],
      fName: json['fName'],
      mName: json['mName'],
      lName: json['lName'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      roleName: json['roleName'],
      userRoleId: json['userRoleId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'fullname': fullname,
      'fName': fName,
      'mName': mName,
      'lName': lName,
      'email': email,
      'phoneNumber': phoneNumber,
      'roleName': roleName,
      'userRoleId': userRoleId,
    };
  }
}
