import 'medical_professional_model.dart';
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
              .map((e) => MedicalProfessional.fromJson(e))
              .toList()
          : null,
      branches: (json['branches'] is List)
          ? (json['branches'] as List)
              .where((e) => e != null)
              .map((e) => BranchSettingModel.fromJson(e))
              .toList()
          : null,
    );
  }
}
