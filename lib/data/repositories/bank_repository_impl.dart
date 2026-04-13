import '../../domain/repositories/bank_repository.dart';
import '../datasources/bank_remote_datasource.dart';
import '../models/bank_model.dart';

class BankRepositoryImpl implements BankRepository {
  final BankRemoteDataSource remoteDataSource;

  BankRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<Bank>> getAllBanks() async {
    return await remoteDataSource.getAllBanks();
  }

  @override
  Future<List<BankAccount>> getAllBankAccounts({int? bankId}) async {
    return await remoteDataSource.getAllBankAccounts(bankId: bankId);
  }

  @override
  Future<Bank> getBankById(int id) async {
    return await remoteDataSource.getBankById(id);
  }

  @override
  Future<BankAccount> getBankAccountById(int id) async {
    return await remoteDataSource.getBankAccountById(id);
  }
}
