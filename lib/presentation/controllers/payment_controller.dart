import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/models/payment_model.dart';
import '../../domain/repositories/payment_repository.dart';
import '../../core/api_client.dart';

class PaymentController extends GetxController {
  final PaymentRepository repository;
  final _box = GetStorage();

  PaymentController({required this.repository});

  final RxList<PaymentModel> payments = <PaymentModel>[].obs;
  final RxBool isLoading = false.obs;
  final RxString error = ''.obs;

  @override
  void onInit() {
    super.onInit();
    // Clear any cached patient data to ensure we get current user's data
    _clearCachedPatientData();
    fetchPayments();
  }

  void _clearCachedPatientData() {
    // Remove any cached patient ID to ensure we fetch fresh data
    _box.remove('patientId');
  }

  Future<void> fetchPayments() async {
    try {
      isLoading.value = true;
      error.value = '';

      // Get patient ID from stored user data
      final patientId = await _getPatientId();
      if (patientId == null) {
        error.value =
            'No patient record found for this user. Please contact support to create a patient profile.';
        return;
      }

      final paymentList = await repository.getPaymentsByPatientId(patientId);

      payments.value = paymentList;
    } catch (e) {
      error.value = 'Failed to load payment history: ${e.toString()}';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshPayments() async {
    await fetchPayments();
  }

  Future<int?> _getPatientId() async {
    try {
      // Always get the current user's patient ID dynamically
      // Don't use cached patientId as it might belong to a different user
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) {
        return null;
      }

      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        try {
          userId = int.parse(userIdRaw);
        } catch (e) {
          return null;
        }
      } else {
        return null;
      }


      // Try the new Patient/byUserId endpoint first (more direct)
      if (!Get.isRegistered<ApiClient>()) {
        return null;
      }

      final apiClient = Get.find<ApiClient>();

      try {
        // First try the direct patient endpoint
        final patientResponse = await apiClient.get(
          '/Patient/byUserId/$userId',
        );

        if (!patientResponse.hasError) {
          final patientData = patientResponse.body;
          final patientId = patientData['id'];

          if (patientId != null) {
            return patientId;
          }
        }
      } catch (e) {
      }

      // Fallback to card endpoint if patient endpoint fails
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (response.hasError) {
        // If user doesn't have a card/patient record, return null
        if (response.statusCode == 404) {
          return null;
        }
        return null;
      }

      final cardData = response.body;
      final patientId = cardData['patient']?['id'];

      if (patientId != null) {
        return patientId;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  String getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
      case 'auto-prepared':
        return 'warning';
      case 'rejected':
      case 'canceled':
        return 'error';
      default:
        return 'info';
    }
  }

  String formatAmount(double amount) {
    return '${amount.toStringAsFixed(2)} ETB';
  }

  String formatDate(DateTime? date) {
    if (date == null) return 'N/A';
    return '${date.day}/${date.month}/${date.year}';
  }
}
