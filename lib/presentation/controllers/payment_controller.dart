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
    print('🧹 Cleared cached patient data');
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
      // Always get the current user's patient ID dynamically
      // Don't use cached patientId as it might belong to a different user
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) {
        print('❌ No userId found in storage');
        return null;
      }

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

      print('🔍 Getting patient ID for current user: $userId');

      // Fetch user's card to get patient ID
      if (!Get.isRegistered<ApiClient>()) {
        print('❌ ApiClient not registered');
        return null;
      }

      final apiClient = Get.find<ApiClient>();
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (response.hasError) {
        print('❌ Error fetching card for user $userId: ${response.statusText}');
        // If user doesn't have a card/patient record, return null
        if (response.statusCode == 404) {
          print('ℹ️ User $userId does not have a patient record');
          return null;
        }
        return null;
      }

      final cardData = response.body;
      final patientId = cardData['patient']?['id'];

      if (patientId != null) {
        print('✅ Found patient ID $patientId for user $userId');
        return patientId;
      }

      print('❌ No patient ID found in card data for user $userId');
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
