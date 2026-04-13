class RequestCardModel {
  final int patientId;
  final int cardTypeId;
  final String requestRemark;
  final PatientDetails patient;

  RequestCardModel({
    required this.patientId,
    required this.cardTypeId,
    required this.requestRemark,
    required this.patient,
  });

  Map<String, dynamic> toJson() {
    return {
      'patientId': patientId,
      'cardTypeId': cardTypeId,
      'requestRemark': requestRemark,
      'patient': patient.toJson(),
    };
  }
}

class PatientDetails {
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
  final String dateOfBirth; // Using String for ISO8601 format to match backend DateOnly expectations
  final bool requiresUserAccount;
  final int? userId; // Added userId

  PatientDetails({
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
    required this.requiresUserAccount,
    this.userId, // Added to constructor
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
      'requiresUserAccount': requiresUserAccount,
      'userId': userId, // Added userId to JSON
    };
  }
}
