import '../repositories/bank_repository.dart';
import '../../data/models/bank_model.dart';

class GetBankDetailsUseCase {
  final BankRepository repository;

  GetBankDetailsUseCase(this.repository);

  Future<List<Bank>> getAllBanks() async {
    return await repository.getAllBanks();
  }

  Future<List<BankAccount>> getAllBankAccounts({int? bankId}) async {
    return await repository.getAllBankAccounts(bankId: bankId);
  }

  Future<Bank> getBankById(int id) async {
    return await repository.getBankById(id);
  }

  Future<BankAccount> getBankAccountById(int id) async {
    return await repository.getBankAccountById(id);
  }
}
