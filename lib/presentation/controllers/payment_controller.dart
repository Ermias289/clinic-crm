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
    fetchPayments();
  }

  Future<void> fetchPayments() async {
    try {
      isLoading.value = true;
      error.value = '';

      // Get patient ID from stored user data
      final patientId = await _getPatientId();
      if (patientId == null) {
        error.value =
            'Unable to find patient information. Please try logging in again.';
        return;
      }

      print('🔍 Fetching payments for patient ID: $patientId');
      final paymentList = await repository.getPaymentsByPatientId(patientId);

      payments.value = paymentList;
      print('✅ Successfully fetched ${paymentList.length} payments');
    } catch (e) {
      error.value = 'Failed to load payment history: ${e.toString()}';
      print('❌ Error fetching payments: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> refreshPayments() async {
    await fetchPayments();
  }

  Future<int?> _getPatientId() async {
    try {
      // First try to get patient ID from stored data
      final storedPatientId = _box.read('patientId');
      if (storedPatientId != null) {
        return storedPatientId is int
            ? storedPatientId
            : int.parse(storedPatientId.toString());
      }

      // If not stored, we need to fetch it from the user's card data
      // This follows the same pattern as appointment_controller.dart
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) return null;

      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        try {
          userId = int.parse(userIdRaw);
        } catch (e) {
          print('❌ Error parsing userId: $e');
          return null;
        }
      } else {
        print('❌ Invalid userId type: ${userIdRaw.runtimeType}');
        return null;
      }

      // Fetch user's card to get patient ID
      if (!Get.isRegistered<ApiClient>()) {
        print('❌ ApiClient not registered');
        return null;
      }

      final apiClient = Get.find<ApiClient>();
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (response.hasError) {
        print('❌ Error fetching card: ${response.statusText}');
        return null;
      }

      final cardData = response.body;
      final patientId = cardData['patient']?['id'];

      if (patientId != null) {
        // Store for future use
        _box.write('patientId', patientId);
        return patientId;
      }

      return null;
    } catch (e) {
      print('❌ Error getting patient ID: $e');
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
