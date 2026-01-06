import '../datasources/card_remote_datasource.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';
import '../models/payment_model.dart';
import '../models/create_payment_request_model.dart';

abstract class CardRepository {
  Future<List<CardSettingModel>> getCardSettings();
  Future<Map<String, dynamic>> requestCard(RequestCardModel request);
  Future<List<PaymentModel>> getPaymentsByCardId(int cardId);
  Future<PaymentModel> createPaymentRequest(CreatePaymentRequest request);
  Future<Map<String, dynamic>?> getMyCard();
  Future<String> uploadPaymentProof(String imagePath);
  Future<void> reactivateCard(int cardId);
}

class CardRepositoryImpl implements CardRepository {
  final CardRemoteDataSource remoteDataSource;

  CardRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    return await remoteDataSource.getCardSettings();
  }

  @override
  Future<Map<String, dynamic>> requestCard(RequestCardModel request) async {
    return await remoteDataSource.requestCard(request);
  }

  @override
  Future<List<PaymentModel>> getPaymentsByCardId(int cardId) async {
    return await remoteDataSource.getPaymentsByCardId(cardId);
  }

  @override
  Future<PaymentModel> createPaymentRequest(
    CreatePaymentRequest request,
  ) async {
    return await remoteDataSource.createPaymentRequest(request);
  }

  @override
  Future<Map<String, dynamic>?> getMyCard() async {
    return await remoteDataSource.getMyCard();
  }

  @override
  Future<String> uploadPaymentProof(String imagePath) async {
    return await remoteDataSource.uploadPaymentProof(imagePath);
  }

  @override
  Future<void> reactivateCard(int cardId) async {
    return await remoteDataSource.reactivateCard(cardId);
  }
}
