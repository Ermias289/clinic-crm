class MedicalProfessional {
  final int id;
  final String fullName;
  final String? phoneNumber;
  final String? email;
  final String? specialization;
  final String? profilePictureUrl;
  final bool isActive;

  MedicalProfessional({
    required this.id,
    required this.fullName,
    this.phoneNumber,
    this.email,
    this.specialization,
    this.profilePictureUrl,
    required this.isActive,
  });

  factory MedicalProfessional.fromJson(Map<String, dynamic> json) {
    // Backend naming can vary; normalize a few common possibilities.
    final fName = (json['fName'] ?? json['firstName'] ?? json['firstname'])
        ?.toString();
    final mName = (json['mName'] ?? json['middleName'] ?? json['middlename'])
        ?.toString();
    final lName = (json['lName'] ?? json['lastName'] ?? json['lastname'])
        ?.toString();

    String buildName() {
      final direct =
          (json['fullName'] ??
                  json['fullname'] ??
                  json['name'] ??
                  json['userName'] ??
                  json['username'])
              ?.toString();
      if (direct != null && direct.trim().isNotEmpty) return direct.trim();

      final parts = <String>[];
      if (fName != null && fName.trim().isNotEmpty) parts.add(fName.trim());
      if (mName != null && mName.trim().isNotEmpty) parts.add(mName.trim());
      if (lName != null && lName.trim().isNotEmpty) parts.add(lName.trim());

      if (parts.isNotEmpty) return parts.join(' ');
      return 'Unknown Doctor';
    }

    return MedicalProfessional(
      id: (json['id'] is int)
          ? json['id'] as int
          : int.tryParse('${json['id'] ?? 0}') ?? 0,
      fullName: buildName(),
      phoneNumber: (json['phoneNumber'] ?? json['phone'] ?? json['mobile'])
          ?.toString(),
      email: (json['email'])?.toString(),
      specialization:
          (json['specialization'] ?? json['speciality'] ?? json['department'])
              ?.toString(),
      profilePictureUrl:
          (json['profilePictureUrl'] ??
                  json['profilePicture'] ??
                  json['pictureUrl'] ??
                  json['photo'])
              ?.toString(),
      isActive: (json['isActive'] is bool)
          ? json['isActive'] as bool
          : (json['active'] is bool)
          ? json['active'] as bool
          : true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'phoneNumber': phoneNumber,
      'email': email,
      'specialization': specialization,
      'profilePictureUrl': profilePictureUrl,
      'isActive': isActive,
    };
  }
}

/// Represents one doctor schedule record as returned by `/api/DoctorSchedule`.
///
/// Note: the backend may include nested `medicalProfessional` objects; this model
/// supports both `medicalProfessionalId` and an optional `medicalProfessional`.
class DoctorSchedule {
  final int id;

  /// The doctor / medical professional this schedule belongs to.
  final int medicalProfessionalId;
  final MedicalProfessional? medicalProfessional;

  /// Optional branch / location id (if present in backend).
  final int? branchSettingId;

  /// Optional service id (if backend links schedules to services).
  final int? medicalServiceId;

  /// Optional day name/enum from backend (e.g. "Monday") or numeric day index.
  final String? dayOfWeek;

  /// Start & end times can come as strings ("09:00:00") or date-times.
  final String? startTime;
  final String? endTime;

  /// If backend provides concrete date ranges.
  final DateTime? startDate;
  final DateTime? endDate;

  /// Slot size / appointment duration if exposed.
  final int? slotDurationInMinutes;

  /// Whether schedule is active/available.
  final bool isActive;

  DoctorSchedule({
    required this.id,
    required this.medicalProfessionalId,
    this.medicalProfessional,
    this.branchSettingId,
    this.medicalServiceId,
    this.dayOfWeek,
    this.startTime,
    this.endTime,
    this.startDate,
    this.endDate,
    this.slotDurationInMinutes,
    required this.isActive,
  });

  static DateTime? _tryParseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    final s = value.toString().trim();
    if (s.isEmpty) return null;
    return DateTime.tryParse(s);
  }

  factory DoctorSchedule.fromJson(Map<String, dynamic> json) {
    final mpIdRaw =
        json['medicalProfessionalId'] ??
        json['doctorId'] ??
        json['medicalProfessionalID'];
    final mpId = (mpIdRaw is int) ? mpIdRaw : int.tryParse('$mpIdRaw') ?? 0;

    MedicalProfessional? mp;
    final mpJson = json['medicalProfessional'] ?? json['doctor'];
    if (mpJson is Map<String, dynamic>) {
      mp = MedicalProfessional.fromJson(mpJson);
    }

    return DoctorSchedule(
      id: (json['id'] is int)
          ? json['id'] as int
          : int.tryParse('${json['id'] ?? 0}') ?? 0,
      medicalProfessionalId: mpId,
      medicalProfessional: mp,
      branchSettingId: (json['branchSettingId'] is int)
          ? json['branchSettingId'] as int
          : int.tryParse('${json['branchSettingId'] ?? ''}'),
      medicalServiceId: (json['medicalServiceId'] is int)
          ? json['medicalServiceId'] as int
          : int.tryParse('${json['medicalServiceId'] ?? ''}'),
      dayOfWeek:
          (json['dayOfWeek'] ??
                  json['weekDay'] ??
                  json['workingDay'] ??
                  json['day'])
              ?.toString(),
      startTime: (json['startTime'] ?? json['from'] ?? json['timeFrom'])
          ?.toString(),
      endTime: (json['endTime'] ?? json['to'] ?? json['timeTo'])?.toString(),
      startDate: _tryParseDate(json['startDate'] ?? json['fromDate']),
      endDate: _tryParseDate(json['endDate'] ?? json['toDate']),
      slotDurationInMinutes: (json['slotDurationInMinutes'] is int)
          ? json['slotDurationInMinutes'] as int
          : int.tryParse(
              '${json['slotDurationInMinutes'] ?? json['durationInMinutes'] ?? ''}',
            ),
      isActive: (json['isActive'] is bool)
          ? json['isActive'] as bool
          : (json['active'] is bool)
          ? json['active'] as bool
          : true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'medicalProfessionalId': medicalProfessionalId,
      'medicalProfessional': medicalProfessional?.toJson(),
      'branchSettingId': branchSettingId,
      'medicalServiceId': medicalServiceId,
      'dayOfWeek': dayOfWeek,
      'startTime': startTime,
      'endTime': endTime,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'slotDurationInMinutes': slotDurationInMinutes,
      'isActive': isActive,
    };
  }
}
