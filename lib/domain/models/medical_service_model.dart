class MedicalService {
  final int id;
  final String name;
  final String description;
  final int durationInMinutes;
  final String servicePicture;

  MedicalService({
    required this.id,
    required this.name,
    required this.description,
    required this.durationInMinutes,
    required this.servicePicture,
  });

  factory MedicalService.fromJson(Map<String, dynamic> json) {
    return MedicalService(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      durationInMinutes: json['durationInMinutes'] ?? 0,
      servicePicture: json['servicePicture'] ?? '',
    );
  }
}
