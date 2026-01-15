import '../../core/api_client.dart';
import '../models/user_notification_model.dart';

abstract class NotificationRemoteDataSource {
  Future<List<UserNotificationModel>> getUserNotifications(int userId);
  Future<UserNotificationModel> markAsRead(int userId, int notificationId);
  Future<bool> markAllAsRead(int userId);
}

class NotificationRemoteDataSourceImpl implements NotificationRemoteDataSource {
  final ApiClient apiClient;

  NotificationRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<UserNotificationModel>> getUserNotifications(int userId) async {
    try {
      final response = await apiClient.get('/Notification?userId=$userId');

      if (response.hasError) {
        throw Exception(
          'Failed to fetch notifications: ${response.statusText}',
        );
      }

      final List<dynamic> body = response.body;

      // Debug: Print each notification
      for (int i = 0; i < body.length; i++) {
      }

      final notifications = body
          .map((e) => UserNotificationModel.fromJson(e))
          .toList();

      return notifications;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<UserNotificationModel> markAsRead(
    int userId,
    int notificationId,
  ) async {
    try {
      final response = await apiClient.put(
        '/Notification/markAsRead?userId=$userId&notificationId=$notificationId',
        {},
      );

      if (response.hasError) {
        throw Exception(
          'Failed to mark notification as read: ${response.statusText}',
        );
      }

      return UserNotificationModel.fromJson(response.body);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<bool> markAllAsRead(int userId) async {
    try {
      final response = await apiClient.put(
        '/Notification/markAllasRead?userId=$userId',
        {},
      );

      if (response.hasError) {
        throw Exception(
          'Failed to mark all notifications as read: ${response.statusText}',
        );
      }

      return response.body == true || response.body['success'] == true;
    } catch (e) {
      rethrow;
    }
  }
}
