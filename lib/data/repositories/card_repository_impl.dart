import '../datasources/card_remote_datasource.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';

abstract class CardRepository {
  Future<List<CardSettingModel>> getCardSettings();
  Future<Map<String, dynamic>> requestCard(RequestCardModel request);
  Future<bool> createPayment(int cardId, String proofPath);
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
  Future<bool> createPayment(int cardId, String proofPath) async {
    return await remoteDataSource.createPayment(cardId, proofPath);
  }
}
