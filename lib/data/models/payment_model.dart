class PaymentModel {
  final int id;
  final String reference;
  final String status;
  final int cardId;
  final double expectedAmount;
  final double unPaidAmount;
  final double paidAmount;
  final String paymentProof;
  final bool isInsuranceCovered;
  final double requestedAmount;
  final int? requestedById;
  final DateTime? requestedAt;
  final DateTime? approvedAt;
  final int? approvedById;
  final double approvedAmount;
  final String approvalRemark;
  final DateTime? rejectedAt;
  final int? rejectedById;
  final String rejectionRemark;
  final DateTime? checkedAt;
  final int? checkedById;
  final String checkRemark;
  final DateTime? canceledAt;
  final int? canceledById;
  final String canceledRemark;
  final DateTime createdAt;
  final DateTime updatedAt;

  PaymentModel({
    required this.id,
    required this.reference,
    required this.status,
    required this.cardId,
    required this.expectedAmount,
    required this.unPaidAmount,
    required this.paidAmount,
    required this.paymentProof,
    required this.isInsuranceCovered,
    required this.requestedAmount,
    this.requestedById,
    this.requestedAt,
    this.approvedAt,
    this.approvedById,
    required this.approvedAmount,
    required this.approvalRemark,
    this.rejectedAt,
    this.rejectedById,
    required this.rejectionRemark,
    this.checkedAt,
    this.checkedById,
    required this.checkRemark,
    this.canceledAt,
    this.canceledById,
    required this.canceledRemark,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'] ?? 0,
      reference: json['reference'] ?? '',
      status: json['status'] ?? '',
      cardId: json['cardId'] ?? 0,
      expectedAmount: (json['expectedAmount'] ?? 0).toDouble(),
      unPaidAmount: (json['unPaidAmount'] ?? 0).toDouble(),
      paidAmount: (json['paidAmount'] ?? 0).toDouble(),
      paymentProof: json['paymentProof'] ?? '',
      isInsuranceCovered: json['isInsuranceCovered'] ?? false,
      requestedAmount: (json['requestedAmount'] ?? 0).toDouble(),
      requestedById: json['requestedById'],
      requestedAt: json['requestedAt'] != null
          ? DateTime.parse(json['requestedAt'])
          : null,
      approvedAt: json['approvedAt'] != null
          ? DateTime.parse(json['approvedAt'])
          : null,
      approvedById: json['approvedById'],
      approvedAmount: (json['approvedAmount'] ?? 0).toDouble(),
      approvalRemark: json['approvalRemark'] ?? '',
      rejectedAt: json['rejectedAt'] != null
          ? DateTime.parse(json['rejectedAt'])
          : null,
      rejectedById: json['rejectedById'],
      rejectionRemark: json['rejectionRemark'] ?? '',
      checkedAt: json['checkedAt'] != null
          ? DateTime.parse(json['checkedAt'])
          : null,
      checkedById: json['checkedById'],
      checkRemark: json['checkRemark'] ?? '',
      canceledAt: json['canceledAt'] != null
          ? DateTime.parse(json['canceledAt'])
          : null,
      canceledById: json['canceledById'],
      canceledRemark: json['canceledRemark'] ?? '',
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      updatedAt: DateTime.parse(
        json['updatedAt'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reference': reference,
      'status': status,
      'cardId': cardId,
      'expectedAmount': expectedAmount,
      'unPaidAmount': unPaidAmount,
      'paidAmount': paidAmount,
      'paymentProof': paymentProof,
      'isInsuranceCovered': isInsuranceCovered,
      'requestedAmount': requestedAmount,
      'requestedById': requestedById,
      'requestedAt': requestedAt?.toIso8601String(),
      'approvedAt': approvedAt?.toIso8601String(),
      'approvedById': approvedById,
      'approvedAmount': approvedAmount,
      'approvalRemark': approvalRemark,
      'rejectedAt': rejectedAt?.toIso8601String(),
      'rejectedById': rejectedById,
      'rejectionRemark': rejectionRemark,
      'checkedAt': checkedAt?.toIso8601String(),
      'checkedById': checkedById,
      'checkRemark': checkRemark,
      'canceledAt': canceledAt?.toIso8601String(),
      'canceledById': canceledById,
      'canceledRemark': canceledRemark,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  bool get isAutoPrepared => status.toLowerCase() == 'auto-prepared';
  bool get isRequested => status.toLowerCase() == 'requested';
  bool get isChecked => status.toLowerCase() == 'checked';
  bool get isApproved => status.toLowerCase() == 'approved';
  bool get isPartiallyPaid => status.toLowerCase() == 'partially-paid';
  bool get isRejected => status.toLowerCase() == 'rejected';
  bool get isCanceled => status.toLowerCase() == 'canceled';
}

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
}
