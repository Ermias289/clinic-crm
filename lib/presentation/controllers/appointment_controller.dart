import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';
import '../../data/models/appointment_model.dart';
import '../../data/models/card_model.dart';
import '../../core/api_client.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../../core/services/appointment_event_service.dart';
import '../../core/utils/error_handler.dart';

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
        refreshAppointments();
      });
    } catch (e, stackTrace) {
      debugPrint('AppointmentController onInit error: $e\n$stackTrace');
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
          debugPrint('Error parsing user ID from string: $e');
          return;
        }
      } else {
        return;
      }

      final apiClient = Get.find<ApiClient>();
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (!response.hasError && response.body != null) {
        userCard.value = CardModel.fromJson(
          response.body as Map<String, dynamic>,
        );
      } else {
        userCard.value = null;
      }
    } catch (e) {
      debugPrint('Error fetching user card: $e');
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
          debugPrint('Error parsing user ID from string: $e');
          error.value = 'Invalid user ID format: $userIdRaw';
          ErrorHandler.showError('Invalid user session. Please log in again.');
          return;
        }
      } else {
        error.value = 'Invalid user ID type: ${userIdRaw.runtimeType}';
        ErrorHandler.showError('Invalid user session. Please log in again.');
        return;
      }

      final result = await repository.getAppointmentsByUserId(userId);
      appointments.assignAll(result);

      // Clear any previous errors if fetch was successful
      error.value = '';
    } catch (e) {
      // Silently handle 404 errors (no appointments found) - don't show error to user
      // Only show error for actual problems like network issues
      final errorMessage = e.toString().toLowerCase();
      if (!errorMessage.contains('404') &&
          !errorMessage.contains('not found') &&
          !errorMessage.contains('no appointments')) {
        ErrorHandler.handleError(e, customTitle: 'Unable to Load Appointments');
      } else {
        // Just log it for debugging, don't show to user
        debugPrint(
          'No appointments found for user (this is normal for new users)',
        );
      }
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
    refreshAppointments();
  }
}
