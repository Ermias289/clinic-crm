import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/models/appointment_model.dart';
import '../../domain/repositories/appointment_repository.dart';

class AppointmentController extends GetxController {
  final AppointmentRepository repository;
  final _box = GetStorage();

  AppointmentController({required this.repository});

  final RxList<AppointmentModel> appointments = <AppointmentModel>[].obs;
  final RxBool isLoading = false.obs;
  final RxString error = ''.obs;

  @override
  void onInit() {
    super.onInit();
    debugUserSession();
    fetchAppointments();
  }

  void debugUserSession() {
    final userId = _box.read('userId');
    final token = _box.read('token');
    final user = _box.read('user');

    print('🔍 Debug User Session:');
    print('  - userId: $userId (${userId.runtimeType})');
    print('  - token: ${token != null ? 'Present' : 'Missing'}');
    print('  - user: $user');
  }

  Future<void> fetchAppointments() async {
    try {
      isLoading.value = true;
      error.value = '';

      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) {
        error.value = 'User ID not found. Please log in again.';
        return;
      }

      // Ensure userId is an integer
      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        try {
          userId = int.parse(userIdRaw);
        } catch (e) {
          error.value = 'Invalid user ID format: $userIdRaw';
          Get.snackbar('Error', 'Invalid user session. Please log in again.');
          return;
        }
      } else {
        error.value = 'Invalid user ID type: ${userIdRaw.runtimeType}';
        Get.snackbar('Error', 'Invalid user session. Please log in again.');
        return;
      }

      print('🔍 Fetching appointments for userId: $userId');
      final result = await repository.getAppointments(userId);
      appointments.assignAll(result);
    } catch (e) {
      error.value = e.toString();
      print('❌ Appointment fetch error: $e');
      Get.snackbar('Error', 'Failed to fetch appointments: ${e.toString()}');
    } finally {
      isLoading.value = false;
    }
  }
}

void refreshAppointments() {
  fetchAppointments();
}

void clearErrorAndRetry() {
  error.value = '';
  fetchAppointments();
}
