import '../../data/models/branch_setting_model.dart';
import 'medical_professional_model.dart';

class MedicalService {
  final int id;
  final String name;
  final String description;
  final int durationInMinutes;
  final String servicePicture;
  final List<MedicalProfessional> medicalProfessionals;
  final List<BranchSettingModel> branches;

  MedicalService({
    required this.id,
    required this.name,
    required this.description,
    required this.durationInMinutes,
    required this.servicePicture,
    this.medicalProfessionals = const [],
    this.branches = const [],
  });

  factory MedicalService.fromJson(Map<String, dynamic> json) {
    // Parse medical professionals
    List<MedicalProfessional> professionals = [];
    if (json['medicalProfessionals'] != null && json['medicalProfessionals'] is List) {
      professionals = (json['medicalProfessionals'] as List)
          .where((item) => item != null)
          .map((item) => MedicalProfessional.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    // Parse branches
    List<BranchSettingModel> branchList = [];
    if (json['branches'] != null && json['branches'] is List) {
      branchList = (json['branches'] as List)
          .where((item) => item != null)
          .map((item) => BranchSettingModel.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    return MedicalService(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      durationInMinutes: json['durationInMinutes'] ?? 0,
      servicePicture: json['servicePicture'] ?? '',
      medicalProfessionals: professionals,
      branches: branchList,
    );
  }
}
