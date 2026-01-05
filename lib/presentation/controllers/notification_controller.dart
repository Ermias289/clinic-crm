import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/models/user_notification_model.dart';
import '../../domain/repositories/notification_repository.dart';

class NotificationController extends GetxController {
  final NotificationRepository repository;
  final _box = GetStorage();

  NotificationController({required this.repository});

  final RxList<UserNotificationModel> notifications =
      <UserNotificationModel>[].obs;
  final RxBool isLoading = false.obs;
  final RxString error = ''.obs;
  final RxInt unreadCount = 0.obs;

  @override
  void onInit() {
    super.onInit();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
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
          return;
        }
      } else {
        error.value = 'Invalid user ID type: ${userIdRaw.runtimeType}';
        return;
      }

      print('🔔 Fetching notifications for userId: $userId');
      final result = await repository.getUserNotifications(userId);
      notifications.assignAll(result);
      _updateUnreadCount();
    } catch (e) {
      error.value = e.toString();
      print('❌ Notification fetch error: $e');
      Get.snackbar('Error', 'Failed to fetch notifications: ${e.toString()}');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> markAsRead(int notificationId) async {
    try {
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) return;

      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        userId = int.parse(userIdRaw);
      } else {
        return;
      }

      await repository.markAsRead(userId, notificationId);

      // Update local state
      final index = notifications.indexWhere(
        (n) => n.notificationId == notificationId,
      );
      if (index != -1) {
        final updatedNotification = UserNotificationModel(
          id: notifications[index].id,
          userId: notifications[index].userId,
          notificationId: notifications[index].notificationId,
          isRead: true,
          readAt: DateTime.now(),
          notification: notifications[index].notification,
        );
        notifications[index] = updatedNotification;
        _updateUnreadCount();
      }
    } catch (e) {
      print('❌ Error marking notification as read: $e');
      Get.snackbar('Error', 'Failed to mark notification as read');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      final userIdRaw = _box.read('userId');
      if (userIdRaw == null) return;

      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        userId = int.parse(userIdRaw);
      } else {
        return;
      }

      final success = await repository.markAllAsRead(userId);
      if (success) {
        // Update local state
        for (int i = 0; i < notifications.length; i++) {
          notifications[i] = UserNotificationModel(
            id: notifications[i].id,
            userId: notifications[i].userId,
            notificationId: notifications[i].notificationId,
            isRead: true,
            readAt: DateTime.now(),
            notification: notifications[i].notification,
          );
        }
        _updateUnreadCount();
        Get.snackbar('Success', 'All notifications marked as read');
      }
    } catch (e) {
      print('❌ Error marking all notifications as read: $e');
      Get.snackbar('Error', 'Failed to mark all notifications as read');
    }
  }

  void _updateUnreadCount() {
    unreadCount.value = notifications.where((n) => n.isRead != true).length;
  }

  Future<void> refreshNotifications() async {
    await fetchNotifications();
  }
}
