import 'medical_professional_model.dart';
import 'medical_service_model.dart';

class AppointmentModel {
  final int? id;
  final String? reference;
  final int dentistryId;
  final int medicalProfessionalId;
  final int? patientId;
  final int? branchId;
  final String reservationTime;
  final String day;
  final String? paymentProof;
  final String? status;
  final MedicalProfessionalModel? medicalProfessional;
  final MedicalServiceModel? dentistryService;

  AppointmentModel({
    this.id,
    this.reference,
    required this.dentistryId,
    required this.medicalProfessionalId,
    this.patientId,
    this.branchId,
    required this.reservationTime,
    required this.day,
    this.paymentProof,
    this.status,
    this.medicalProfessional,
    this.dentistryService,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json['id'],
      reference: json['reference'],
      dentistryId: json['dentistryId'] ?? 0,
      medicalProfessionalId: json['medicalProfessionalId'] ?? 0,
      patientId: json['patientId'],
      branchId: json['branchId'],
      reservationTime: json['reservationTime']?.toString() ?? '',
      day: json['day']?.toString() ?? '',
      paymentProof: json['paymentProof'],
      status: json['status'],
      medicalProfessional: json['medicalProfessional'] != null
          ? MedicalProfessionalModel.fromJson(json['medicalProfessional'])
          : null,
      dentistryService: json['dentistry'] != null
          ? MedicalServiceModel.fromJson(json['dentistry'])
          : json['dentistryService'] != null
          ? MedicalServiceModel.fromJson(json['dentistryService'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dentistryId': dentistryId,
      'medicalProfessionalId': medicalProfessionalId,
      'patientId': patientId,
      'branchId': branchId,
      'reservationTime': reservationTime,
      'day': day,
      'paymentProof': paymentProof,
    };
  }
}
