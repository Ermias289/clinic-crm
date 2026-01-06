import '../../data/models/payment_model.dart';

abstract class PaymentRepository {
  Future<List<PaymentModel>> getPaymentsByPatientId(int patientId);
}
