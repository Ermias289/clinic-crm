class AppointmentModel {
  final int dentistryId;
  final int medicalProfessionalId;
  final int? patientId;
  final int? branchId;
  final String reservationTime;
  final String day;
  final String paymentProof;

  AppointmentModel({
    required this.dentistryId,
    required this.medicalProfessionalId,
    this.patientId,
    this.branchId,
    required this.reservationTime,
    required this.day,
    required this.paymentProof,
  });

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