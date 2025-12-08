class RequestCardModel {
  final int patientId;
  final int cardTypeId;
  final String requestRemark;

  RequestCardModel({
    required this.patientId,
    required this.cardTypeId,
    required this.requestRemark,
  });

  Map<String, dynamic> toJson() {
    return {
      'patientId': patientId,
      'cardTypeId': cardTypeId,
      'requestRemark': requestRemark,
    };
  }
}
