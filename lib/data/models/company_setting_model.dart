class CompanySettingModel {
  final int? id;
  final String? name;
  final String? logo;
  final String? prefix;
  final String? email;
  final String? phoneNumber;
  final String? address;
  final String? city;
  final String? country;
  final String? subCity;
  final String? updatedAt;

  CompanySettingModel({
    this.id,
    this.name,
    this.logo,
    this.prefix,
    this.email,
    this.phoneNumber,
    this.address,
    this.city,
    this.country,
    this.subCity,
    this.updatedAt,
  });

  factory CompanySettingModel.fromJson(Map<String, dynamic> json) {
    return CompanySettingModel(
      id: json['id'],
      name: json['name'],
      logo: json['logo'],
      prefix: json['prefix'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      address: json['address'],
      city: json['city'],
      country: json['country'],
      subCity: json['subCity'],
      updatedAt: json['updatedAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'logo': logo,
      'prefix': prefix,
      'email': email,
      'phoneNumber': phoneNumber,
      'address': address,
      'city': city,
      'country': country,
      'subCity': subCity,
      'updatedAt': updatedAt,
    };
  }
}
