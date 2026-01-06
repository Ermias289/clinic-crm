class CreatePaymentRequest {
  final int id;
  final double requestedAmount;
  final String paymentProof;
  final bool isInsuranceCovered;

  CreatePaymentRequest({
    required this.id,
    required this.requestedAmount,
    required this.paymentProof,
    required this.isInsuranceCovered,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'requestedAmount': requestedAmount,
      'paymentProof': paymentProof,
      'isInsuranceCovered': isInsuranceCovered,
    };
  }

  factory CreatePaymentRequest.fromJson(Map<String, dynamic> json) {
    return CreatePaymentRequest(
      id: json['id'] ?? 0,
      requestedAmount: (json['requestedAmount'] ?? 0).toDouble(),
      paymentProof: json['paymentProof'] ?? '',
      isInsuranceCovered: json['isInsuranceCovered'] ?? false,
    );
  }
}
