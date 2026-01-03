class PatientModel {
  final int id;
  final String fName;
  final String mName;
  final String lName;
  final String email;
  final String phoneNumber;
  final String gender;
  final String alergies;
  final String chronicConditions;
  final String emergencyContactName;
  final String emergencyContactPhone;
  final String address;
  final String subCity;
  final String country;
  final String city;
  final String dateOfBirth;
  final int? userId;
  final bool requiresUserAccount;
  final DateTime createdAt;
  final DateTime updatedAt;

  PatientModel({
    required this.id,
    required this.fName,
    required this.mName,
    required this.lName,
    required this.email,
    required this.phoneNumber,
    required this.gender,
    required this.alergies,
    required this.chronicConditions,
    required this.emergencyContactName,
    required this.emergencyContactPhone,
    required this.address,
    required this.subCity,
    required this.country,
    required this.city,
    required this.dateOfBirth,
    this.userId,
    required this.requiresUserAccount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PatientModel.fromJson(Map<String, dynamic> json) {
    return PatientModel(
      id: json['id'] ?? 0,
      fName: json['fName'] ?? '',
      mName: json['mName'] ?? '',
      lName: json['lName'] ?? '',
      email: json['email'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      gender: json['gender'] ?? '',
      alergies: json['alergies'] ?? '',
      chronicConditions: json['chronicConditions'] ?? '',
      emergencyContactName: json['emergencyContactName'] ?? '',
      emergencyContactPhone: json['emergencyContactPhone'] ?? '',
      address: json['address'] ?? '',
      subCity: json['subCity'] ?? '',
      country: json['country'] ?? '',
      city: json['city'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      userId: json['userId'],
      requiresUserAccount: json['requiresUserAccount'] ?? false,
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updatedAt'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fName': fName,
      'mName': mName,
      'lName': lName,
      'email': email,
      'phoneNumber': phoneNumber,
      'gender': gender,
      'alergies': alergies,
      'chronicConditions': chronicConditions,
      'emergencyContactName': emergencyContactName,
      'emergencyContactPhone': emergencyContactPhone,
      'address': address,
      'subCity': subCity,
      'country': country,
      'city': city,
      'dateOfBirth': dateOfBirth,
      'userId': userId,
      'requiresUserAccount': requiresUserAccount,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class CreatePatientRequest {
  final String fName;
  final String mName;
  final String lName;
  final String email;
  final String phoneNumber;
  final String gender;
  final String alergies;
  final String chronicConditions;
  final String emergencyContactName;
  final String emergencyContactPhone;
  final String address;
  final String subCity;
  final String country;
  final String city;
  final String dateOfBirth;
  final int userId;
  final bool requiresUserAccount;

  CreatePatientRequest({
    required this.fName,
    required this.mName,
    required this.lName,
    required this.email,
    required this.phoneNumber,
    required this.gender,
    required this.alergies,
    required this.chronicConditions,
    required this.emergencyContactName,
    required this.emergencyContactPhone,
    required this.address,
    required this.subCity,
    required this.country,
    required this.city,
    required this.dateOfBirth,
    required this.userId,
    required this.requiresUserAccount,
  });

  Map<String, dynamic> toJson() {
    return {
      'fName': fName,
      'mName': mName,
      'lName': lName,
      'email': email,
      'phoneNumber': phoneNumber,
      'gender': gender,
      'alergies': alergies,
      'chronicConditions': chronicConditions,
      'emergencyContactName': emergencyContactName,
      'emergencyContactPhone': emergencyContactPhone,
      'address': address,
      'subCity': subCity,
      'country': country,
      'city': city,
      'dateOfBirth': dateOfBirth,
      'userId': userId,
      'requiresUserAccount': requiresUserAccount,
    };
  }
}
