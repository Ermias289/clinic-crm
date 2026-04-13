class MedicalServiceModel {
  final int id;
  final String name;
  final String description;
  final int durationInMinutes;

  MedicalServiceModel({
    required this.id,
    required this.name,
    required this.description,
    required this.durationInMinutes,
  });

  factory MedicalServiceModel.fromJson(Map<String, dynamic> json) {
    return MedicalServiceModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      durationInMinutes: json['durationInMinutes'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'durationInMinutes': durationInMinutes,
    };
  }
}
