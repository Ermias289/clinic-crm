import '../../data/models/user_notification_model.dart';

abstract class NotificationRepository {
  Future<List<UserNotificationModel>> getUserNotifications(int userId);
  Future<UserNotificationModel> markAsRead(int userId, int notificationId);
  Future<bool> markAllAsRead(int userId);
}
