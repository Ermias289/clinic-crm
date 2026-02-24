import '../../data/models/branch_setting_model.dart';

class MedicalService {
  final int id;
  final String name;
  final String description;
  final int durationInMinutes;
  final String servicePicture;
  final List<MedicalProfessional>? medicalProfessionals;
  final List<BranchSettingModel>? branches;

  MedicalService({
    required this.id,
    required this.name,
    required this.description,
    required this.durationInMinutes,
    required this.servicePicture,
    this.medicalProfessionals,
    this.branches,
  });

  factory MedicalService.fromJson(Map<String, dynamic> json) {
    return MedicalService(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      durationInMinutes: json['durationInMinutes'] ?? 0,
      servicePicture: json['servicePicture'] ?? '',
      medicalProfessionals: (json['medicalProfessionals'] is List)
          ? (json['medicalProfessionals'] as List)
                .where((e) => e != null)
                .map(
                  (e) => MedicalProfessional.fromJson(
                    Map<String, dynamic>.from(e as Map),
                  ),
                )
                .toList()
          : null,
      branches: (json['branches'] is List)
          ? (json['branches'] as List)
                .where((e) => e != null)
                .map(
                  (e) => BranchSettingModel.fromJson(
                    Map<String, dynamic>.from(e as Map),
                  ),
                )
                .toList()
          : null,
    );
  }
}

class MedicalProfessional {
  final int id;
  final String fName;
  final String mName;
  final String lName;
  final String? email;
  final String? phoneNumber;
  final String? prefix;
  final String? jobTitle;
  final String? specialty;
  final String? licenseNumber;
  final String? educationalBackground;
  final int? yearsOfExperience;
  final String? status;
  final String? profilePicture;
  final bool? requiresUserAccount;

  MedicalProfessional({
    required this.id,
    required this.fName,
    required this.mName,
    required this.lName,
    this.email,
    this.phoneNumber,
    this.prefix,
    this.jobTitle,
    this.specialty,
    this.licenseNumber,
    this.educationalBackground,
    this.yearsOfExperience,
    this.status,
    this.profilePicture,
    this.requiresUserAccount,
  });

  String get fullName {
    final parts = <String>[];
    if (fName.trim().isNotEmpty) parts.add(fName.trim());
    if (mName.trim().isNotEmpty) parts.add(mName.trim());
    if (lName.trim().isNotEmpty) parts.add(lName.trim());
    return parts.isNotEmpty ? parts.join(' ') : 'Unknown Doctor';
  }

  bool get isActive {
    return status?.toLowerCase() == 'active';
  }

  factory MedicalProfessional.fromJson(Map<String, dynamic> json) {
    return MedicalProfessional(
      id: json['id'] ?? 0,
      fName: json['fName'] ?? '',
      mName: json['mName'] ?? '',
      lName: json['lName'] ?? '',
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      prefix: json['prefix'],
      jobTitle: json['jobTitle'],
      specialty: json['specialty'],
      licenseNumber: json['licenseNumber'],
      educationalBackground: json['educationalBackground'],
      yearsOfExperience: json['yearsOfExperience'] ?? 0,
      status: json['status'],
      profilePicture: json['profilePicture'],
      requiresUserAccount: json['requiresUserAccount'] ?? false,
    );
  }
}
