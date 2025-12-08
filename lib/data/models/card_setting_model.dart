import 'card_type_model.dart';

class CardSettingModel {
  final int id;
  final double price;
  final int expirationDuration;
  final int? cardTypeId;
  final CardTypeModel? cardType;

  CardSettingModel({
    required this.id,
    required this.price,
    required this.expirationDuration,
    this.cardTypeId,
    this.cardType,
  });

  factory CardSettingModel.fromJson(Map<String, dynamic> json) {
    return CardSettingModel(
      id: json['id'] ?? 0,
      price: (json['price'] ?? 0).toDouble(),
      expirationDuration: json['expirationDuration'] ?? 0,
      cardTypeId: json['cardTypeId'],
      cardType: json['cardType'] != null
          ? CardTypeModel.fromJson(json['cardType'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'price': price,
      'expirationDuration': expirationDuration,
      'cardTypeId': cardTypeId,
      'cardType': cardType?.toJson(),
    };
  }
}
