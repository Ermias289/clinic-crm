import '../../core/api_client.dart';
import '../models/bank_model.dart';

abstract class BankRemoteDataSource {
  Future<List<Bank>> getAllBanks();
  Future<List<BankAccount>> getAllBankAccounts({int? bankId});
  Future<Bank> getBankById(int id);
  Future<BankAccount> getBankAccountById(int id);
}

class BankRemoteDataSourceImpl implements BankRemoteDataSource {
  final ApiClient apiClient;

  BankRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<Bank>> getAllBanks() async {
    try {
      final response = await apiClient.get('/bank');

      if (response.hasError) {
        throw Exception('Unable to load banks');
      }

      final List<dynamic> banksJson = response.body;
      return banksJson.map((json) => Bank.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<BankAccount>> getAllBankAccounts({int? bankId}) async {
    try {
      String endpoint = '/bankaccount';
      if (bankId != null) {
        endpoint += '?Id=$bankId';
      }
      final response = await apiClient.get(endpoint);

      if (response.hasError) {
        throw Exception('Unable to load bank accounts');
      }

      final List<dynamic> accountsJson = response.body;
      return accountsJson.map((json) => BankAccount.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Bank> getBankById(int id) async {
    try {
      final response = await apiClient.get('/bank/$id');
      return Bank.fromJson(response.body);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<BankAccount> getBankAccountById(int id) async {
    try {
      final response = await apiClient.get('/bankaccount/$id');
      return BankAccount.fromJson(response.body);
    } catch (e) {
      rethrow;
    }
  }
}
