import '../../data/models/bank_model.dart';

abstract class BankRepository {
  Future<List<Bank>> getAllBanks();
  Future<List<BankAccount>> getAllBankAccounts({int? bankId});
  Future<Bank> getBankById(int id);
  Future<BankAccount> getBankAccountById(int id);
}
