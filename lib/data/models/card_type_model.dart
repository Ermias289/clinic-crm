class CardTypeModel {
  final int id;
  final String name;
  final String description;

  CardTypeModel({
    required this.id,
    required this.name,
    required this.description,
  });

  factory CardTypeModel.fromJson(Map<String, dynamic> json) {
    return CardTypeModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
    };
  }
}
