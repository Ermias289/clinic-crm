class MedicalProfessionalModel {
  final int id;
  final String fName;
  final String lName;
  final String prefix;
  final String specialty;
  final String jobTitle;

  MedicalProfessionalModel({
    required this.id,
    required this.fName,
    required this.lName,
    required this.prefix,
    required this.specialty,
    required this.jobTitle,
  });

  factory MedicalProfessionalModel.fromJson(Map<String, dynamic> json) {
    return MedicalProfessionalModel(
      id: json['id'] ?? 0,
      fName: json['fName'] ?? '',
      lName: json['lName'] ?? '',
      prefix: json['prefix'] ?? '',
      specialty: json['specialty'] ?? '',
      jobTitle: json['jobTitle'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fName': fName,
      'lName': lName,
      'prefix': prefix,
      'specialty': specialty,
      'jobTitle': jobTitle,
    };
  }
}
