class PaymentModel {
  final int id;
  final String reference;
  final String status;
  final CardModel? card;
  final int cardId;
  final double expectedAmount;
  final double unPaidAmount;
  final double paidAmount;
  final String paymentProof;
  final bool isInsuranceCovered;
  final double requestedAmount;
  final UserModel? requestedBy;
  final int? requestedById;
  final DateTime? requestedAt;
  final DateTime? approvedAt;
  final UserModel? approvedBy;
  final int? approvedById;
  final double approvedAmount;
  final String approvalRemark;
  final DateTime? rejectedAt;
  final UserModel? rejectedBy;
  final int? rejectedById;
  final String rejectionRemark;
  final DateTime? checkedAt;
  final UserModel? checkedBy;
  final int? checkedById;
  final String checkRemark;
  final DateTime? canceledAt;
  final UserModel? canceledBy;
  final int? canceledById;
  final String canceledRemark;
  final DateTime createdAt;
  final DateTime updatedAt;

  PaymentModel({
    required this.id,
    required this.reference,
    required this.status,
    this.card,
    required this.cardId,
    required this.expectedAmount,
    required this.unPaidAmount,
    required this.paidAmount,
    required this.paymentProof,
    required this.isInsuranceCovered,
    required this.requestedAmount,
    this.requestedBy,
    this.requestedById,
    this.requestedAt,
    this.approvedAt,
    this.approvedBy,
    this.approvedById,
    required this.approvedAmount,
    required this.approvalRemark,
    this.rejectedAt,
    this.rejectedBy,
    this.rejectedById,
    required this.rejectionRemark,
    this.checkedAt,
    this.checkedBy,
    this.checkedById,
    required this.checkRemark,
    this.canceledAt,
    this.canceledBy,
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
      card: json['card'] != null ? CardModel.fromJson(json['card']) : null,
      cardId: json['cardId'] ?? 0,
      expectedAmount: (json['expectedAmount'] ?? 0).toDouble(),
      unPaidAmount: (json['unPaidAmount'] ?? 0).toDouble(),
      paidAmount: (json['paidAmount'] ?? 0).toDouble(),
      paymentProof: json['paymentProof'] ?? '',
      isInsuranceCovered: json['isInsuranceCovered'] ?? false,
      requestedAmount: (json['requestedAmount'] ?? 0).toDouble(),
      requestedBy: json['requestedBy'] != null
          ? UserModel.fromJson(json['requestedBy'])
          : null,
      requestedById: json['requestedById'],
      requestedAt: json['requestedAt'] != null
          ? DateTime.parse(json['requestedAt'])
          : null,
      approvedAt: json['approvedAt'] != null
          ? DateTime.parse(json['approvedAt'])
          : null,
      approvedBy: json['approvedBy'] != null
          ? UserModel.fromJson(json['approvedBy'])
          : null,
      approvedById: json['approvedById'],
      approvedAmount: (json['approvedAmount'] ?? 0).toDouble(),
      approvalRemark: json['approvalRemark'] ?? '',
      rejectedAt: json['rejectedAt'] != null
          ? DateTime.parse(json['rejectedAt'])
          : null,
      rejectedBy: json['rejectedBy'] != null
          ? UserModel.fromJson(json['rejectedBy'])
          : null,
      rejectedById: json['rejectedById'],
      rejectionRemark: json['rejectionRemark'] ?? '',
      checkedAt: json['checkedAt'] != null
          ? DateTime.parse(json['checkedAt'])
          : null,
      checkedBy: json['checkedBy'] != null
          ? UserModel.fromJson(json['checkedBy'])
          : null,
      checkedById: json['checkedById'],
      checkRemark: json['checkRemark'] ?? '',
      canceledAt: json['canceledAt'] != null
          ? DateTime.parse(json['canceledAt'])
          : null,
      canceledBy: json['canceledBy'] != null
          ? UserModel.fromJson(json['canceledBy'])
          : null,
      canceledById: json['canceledById'],
      canceledRemark: json['canceledRemark'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reference': reference,
      'status': status,
      'card': card?.toJson(),
      'cardId': cardId,
      'expectedAmount': expectedAmount,
      'unPaidAmount': unPaidAmount,
      'paidAmount': paidAmount,
      'paymentProof': paymentProof,
      'isInsuranceCovered': isInsuranceCovered,
      'requestedAmount': requestedAmount,
      'requestedBy': requestedBy?.toJson(),
      'requestedById': requestedById,
      'requestedAt': requestedAt?.toIso8601String(),
      'approvedAt': approvedAt?.toIso8601String(),
      'approvedBy': approvedBy?.toJson(),
      'approvedById': approvedById,
      'approvedAmount': approvedAmount,
      'approvalRemark': approvalRemark,
      'rejectedAt': rejectedAt?.toIso8601String(),
      'rejectedBy': rejectedBy?.toJson(),
      'rejectedById': rejectedById,
      'rejectionRemark': rejectionRemark,
      'checkedAt': checkedAt?.toIso8601String(),
      'checkedBy': checkedBy?.toJson(),
      'checkedById': checkedById,
      'checkRemark': checkRemark,
      'canceledAt': canceledAt?.toIso8601String(),
      'canceledBy': canceledBy?.toJson(),
      'canceledById': canceledById,
      'canceledRemark': canceledRemark,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  // Helper getter for checking if payment is auto-prepared
  bool get isAutoPrepared => status.toLowerCase() == 'auto-prepared';
}

class UserModel {
  final int id;
  final String username;
  final String fName;
  final String mName;
  final String lName;
  final String email;
  final String phoneNumber;
  final int userRoleId;

  UserModel({
    required this.id,
    required this.username,
    required this.fName,
    required this.mName,
    required this.lName,
    required this.email,
    required this.phoneNumber,
    required this.userRoleId,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      fName: json['fName'] ?? '',
      mName: json['mName'] ?? '',
      lName: json['lName'] ?? '',
      email: json['email'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      userRoleId: json['userRoleId'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'fName': fName,
      'mName': mName,
      'lName': lName,
      'email': email,
      'phoneNumber': phoneNumber,
      'userRoleId': userRoleId,
    };
  }
}

class CardModel {
  final int id;
  final String cardNumber;
  final String status;

  CardModel({required this.id, required this.cardNumber, required this.status});

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      id: json['id'] ?? 0,
      cardNumber: json['cardNumber'] ?? '',
      status: json['status'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'cardNumber': cardNumber, 'status': status};
  }
}
