import '../datasources/payment_remote_data_source.dart';
import '../models/payment_model.dart';
import '../../domain/repositories/payment_repository.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  final PaymentRemoteDataSource remoteDataSource;

  PaymentRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<PaymentModel>> getPaymentsByPatientId(int patientId) async {
    return await remoteDataSource.getPaymentsByPatientId(patientId);
  }
}
