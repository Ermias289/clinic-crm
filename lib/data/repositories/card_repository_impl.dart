import '../datasources/card_remote_datasource.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';

abstract class CardRepository {
  Future<List<CardSettingModel>> getCardSettings();
  Future<Map<String, dynamic>> requestCard(RequestCardModel request);
  Future<List<Map<String, dynamic>>> getPaymentsByCardId(int cardId);
  Future<bool> createPayment(int paymentId, String proofPath);
  Future<Map<String, dynamic>?> getMyCard();
  Future<String> uploadPaymentProof(String imagePath); // New method
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
  Future<List<Map<String, dynamic>>> getPaymentsByCardId(int cardId) async {
    return await remoteDataSource.getPaymentsByCardId(cardId);
  }

  @override
  Future<bool> createPayment(int paymentId, String proofPath) async {
    return await remoteDataSource.createPayment(paymentId, proofPath);
  }

  @override
  Future<Map<String, dynamic>?> getMyCard() async {
    return await remoteDataSource.getMyCard();
  }

  @override
  Future<String> uploadPaymentProof(String imagePath) async {
    return await remoteDataSource.uploadPaymentProof(imagePath);
  }
}
