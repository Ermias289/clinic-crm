import 'patient_model.dart';
import 'card_type_model.dart';

class CardModel {
  final int id;
  final String cardNumber;
  final int patientId;
  final int cardTypeId;
  final String status;
  final int? requestedById;
  final String requestRemark;
  final DateTime? requestedAt;
  final int? activatedById;
  final String activationRemark;
  final DateTime? activatedAt;
  final DateTime? expiredAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  final PatientModel? patient;
  final CardTypeModel? cardType;

  CardModel({
    required this.id,
    required this.cardNumber,
    required this.patientId,
    required this.cardTypeId,
    required this.status,
    this.requestedById,
    required this.requestRemark,
    this.requestedAt,
    this.activatedById,
    required this.activationRemark,
    this.activatedAt,
    this.expiredAt,
    required this.createdAt,
    required this.updatedAt,
    this.patient,
    this.cardType,
  });

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      id: json['id'] ?? 0,
      cardNumber: json['cardNumber'] ?? '',
      patientId: json['patientId'] ?? 0,
      cardTypeId: json['cardTypeId'] ?? 0,
      status: json['status'] ?? '',
      requestedById: json['requestedById'],
      requestRemark: json['requestRemark'] ?? '',
      requestedAt: json['requestedAt'] != null
          ? DateTime.parse(json['requestedAt'])
          : null,
      activatedById: json['activatedById'],
      activationRemark: json['activationRemark'] ?? '',
      activatedAt: json['activatedAt'] != null
          ? DateTime.parse(json['activatedAt'])
          : null,
      expiredAt: json['expiredAt'] != null
          ? DateTime.parse(json['expiredAt'])
          : null,
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updatedAt'] ?? DateTime.now().toIso8601String(),
      ),
      patient: json['patient'] != null
          ? PatientModel.fromJson(json['patient'])
          : null,
      cardType: json['cardType'] != null
          ? CardTypeModel.fromJson(json['cardType'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'cardNumber': cardNumber,
      'patientId': patientId,
      'cardTypeId': cardTypeId,
      'status': status,
      'requestedById': requestedById,
      'requestRemark': requestRemark,
      'requestedAt': requestedAt?.toIso8601String(),
      'activatedById': activatedById,
      'activationRemark': activationRemark,
      'activatedAt': activatedAt?.toIso8601String(),
      'expiredAt': expiredAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'patient': patient?.toJson(),
      'cardType': cardType?.toJson(),
    };
  }

  bool get isActive => status.toLowerCase() == 'active';
  bool get isInactive => status.toLowerCase() == 'inactive';
  bool get isExpired => status.toLowerCase() == 'expired';

  DateTime? get calculatedExpiryDate {
    if (activatedAt != null) {
      // Default to 365 days if no specific duration is available
      // In a real implementation, you'd get this from CardSetting
      return activatedAt!.add(const Duration(days: 365));
    }
    return expiredAt;
  }
}
