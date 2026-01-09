import 'package:get/get.dart';

/// Service to handle appointment-related events across the app
class AppointmentEventService extends GetxService {
  static AppointmentEventService get to => Get.find();

  // Observable to track when appointments need to be refreshed
  final RxBool _shouldRefreshAppointments = false.obs;

  /// Trigger a refresh of appointments list
  void triggerAppointmentRefresh() {
    _shouldRefreshAppointments.value = !_shouldRefreshAppointments.value;
  }

  /// Get the refresh trigger observable
  RxBool get refreshTrigger => _shouldRefreshAppointments;

  /// Notify that a new appointment was created
  void notifyAppointmentCreated() {
    print(
      '📅 AppointmentEventService: New appointment created, triggering refresh',
    );
    triggerAppointmentRefresh();
  }

  /// Notify that appointments data might be stale
  void notifyAppointmentsStale() {
    print(
      '📅 AppointmentEventService: Appointments data is stale, triggering refresh',
    );
    triggerAppointmentRefresh();
  }
}
