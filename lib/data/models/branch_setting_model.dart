class BranchSettingModel {
  final int id;
  final String? name;
  final String? address;
  final String? phoneNumber;
  final String? subCity;
  final String? city;
  final String? location;

  BranchSettingModel({
    required this.id,
    this.name,
    this.address,
    this.phoneNumber,
    this.subCity,
    this.city,
    this.location,
  });

  factory BranchSettingModel.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return BranchSettingModel(id: 0); // Provide default id
    }

    return BranchSettingModel(
      id: (json['id'] is int)
          ? json['id'] as int
          : int.tryParse('${json['id'] ?? 0}') ?? 0,
      name: json['name'],
      address: json['address'],
      phoneNumber: json['phoneNumber'],
      subCity: json['subCity'],
      city: json['city'],
      location: json['location'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'phoneNumber': phoneNumber,
      'subCity': subCity,
      'city': city,
      'location': location,
    };
  }
}
