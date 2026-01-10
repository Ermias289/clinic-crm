import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'dart:async';
import '../../data/models/appointment_model.dart';
import '../../data/models/card_model.dart';
import '../../core/api_client.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../../core/services/appointment_event_service.dart';

class AppointmentController extends GetxController {
  final AppointmentRepository repository;
  final _box = GetStorage();
  Timer? _refreshTimer;

  AppointmentController({required this.repository});

  final RxList<AppointmentModel> appointments = <AppointmentModel>[].obs;
  final Rx<CardModel?> userCard = Rx<CardModel?>(null);
  final RxBool isLoading = false.obs;
  final RxString error = ''.obs;

  @override
  void onInit() {
    super.onInit();
    debugUserSession();
    fetchAppointments();
    fetchUserCard();

    // Listen to appointment events for automatic refresh
    try {
      final eventService = Get.find<AppointmentEventService>();
      ever(eventService.refreshTrigger, (_) {
        print(
          '📅 AppointmentController: Received refresh trigger, refreshing appointments',
        );
        refreshAppointments();
      });
    } catch (e) {
      print(
        '⚠️ AppointmentController: Could not find AppointmentEventService: $e',
      );
    }

    // Periodic refresh disabled to improve performance
    // _startPeriodicRefresh();
  }

  @override
  void onClose() {
    _refreshTimer?.cancel();
    super.onClose();
  }

  // Periodic refresh method disabled to improve performance
  // void _startPeriodicRefresh() {
  //   _refreshTimer?.cancel();
  //   _refreshTimer = Timer.periodic(const Duration(minutes: 2), (timer) {
  //     print('📅 AppointmentController: Periodic refresh triggered');
  //     refreshAppointments();
  //   });
  // }

  void debugUserSession() {
    final userId = _box.read('userId');
    final token = _box.read('token');
    final user = _box.read('user');

    print('🔍 Debug User Session:');
    print('  - userId: $userId (${userId.runtimeType})');
    print('  - token: ${token != null ? 'Present' : 'Missing'}');
    print('  - user: $user');
  }

  Future<void> fetchUserCard() async {
    try {
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) return;

      // Ensure userId is an int
      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        try {
          userId = int.parse(userIdRaw);
        } catch (e) {
          return;
        }
      } else {
        return;
      }

      print('🌐 Fetching user card for appointments view...');
      final apiClient = Get.find<ApiClient>();
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (!response.hasError && response.body != null) {
        userCard.value = CardModel.fromJson(
          response.body as Map<String, dynamic>,
        );
        print(
          '✅ Card loaded in AppointmentController: ${userCard.value?.cardNumber}',
        );
      } else {
        userCard.value = null;
        print('⚠️ No card found for user in AppointmentController');
      }
    } catch (e) {
      print('❌ Error fetching card in AppointmentController: $e');
      userCard.value = null;
    }
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

  Future<void> refreshAppointments() async {
    await Future.wait([fetchAppointments(), fetchUserCard()]);
  }

  void clearErrorAndRetry() {
    error.value = '';
    fetchAppointments();
    fetchUserCard();
  }

  /// Force refresh appointments (useful for testing or manual refresh)
  void forceRefresh() {
    print('🔄 AppointmentController: Force refresh triggered');
    refreshAppointments();
  }
}
