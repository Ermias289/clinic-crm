class WorkingDaySettingModel {
  final int? id;
  final String? day;
  final String? openingTime;
  final String? closingTime;
  final bool? isWorkingDay;
  final int? companySettingId;

  WorkingDaySettingModel({
    this.id,
    this.day,
    this.openingTime,
    this.closingTime,
    this.isWorkingDay,
    this.companySettingId,
  });

  factory WorkingDaySettingModel.fromJson(Map<String, dynamic> json) {
    return WorkingDaySettingModel(
      id: json['id'],
      day: json['day'],
      openingTime: json['openingTime'],
      closingTime: json['closingTime'],
      isWorkingDay: json['isWorkingDay'],
      companySettingId: json['companySettingId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'day': day,
      'openingTime': openingTime,
      'closingTime': closingTime,
      'isWorkingDay': isWorkingDay,
      'companySettingId': companySettingId,
    };
  }
}
