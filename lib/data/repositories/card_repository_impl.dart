import '../datasources/card_remote_datasource.dart';
import '../models/card_setting_model.dart';
import '../models/request_card_model.dart';

abstract class CardRepository {
  Future<List<CardSettingModel>> getCardSettings();
  Future<bool> requestCard(RequestCardModel request);
}

class CardRepositoryImpl implements CardRepository {
  final CardRemoteDataSource remoteDataSource;

  CardRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<CardSettingModel>> getCardSettings() async {
    return await remoteDataSource.getCardSettings();
  }

  @override
  Future<bool> requestCard(RequestCardModel request) async {
    return await remoteDataSource.requestCard(request);
  }
}
