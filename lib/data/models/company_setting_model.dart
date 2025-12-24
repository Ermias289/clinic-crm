import 'branch_setting_model.dart';
import 'working_day_setting_model.dart';

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
  final String? createdAt;
  final String? updatedAt;
  final List<BranchSettingModel>? branches;
  final List<WorkingDaySettingModel>? workdays;

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
    this.createdAt,
    this.updatedAt,
    this.branches,
    this.workdays,
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
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      branches: json['branches'] != null
          ? (json['branches'] as List)
                .map((branch) => BranchSettingModel.fromJson(branch))
                .toList()
          : null,
      workdays: json['workdays'] != null
          ? (json['workdays'] as List)
                .map((workday) => WorkingDaySettingModel.fromJson(workday))
                .toList()
          : null,
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
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'branches': branches?.map((branch) => branch.toJson()).toList(),
      'workdays': workdays?.map((workday) => workday.toJson()).toList(),
    };
  }
}
