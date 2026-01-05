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
      print('🔔 Fetching notifications for user ID: $userId');
      final response = await apiClient.get('/Notification?userId=$userId');

      print('🔔 Raw API response: ${response.body}');
      print('🔔 Response status: ${response.statusCode}');
      print('🔔 Response hasError: ${response.hasError}');

      if (response.hasError) {
        print('❌ Failed to fetch notifications: ${response.statusText}');
        throw Exception(
          'Failed to fetch notifications: ${response.statusText}',
        );
      }

      final List<dynamic> body = response.body;
      print('✅ Successfully fetched ${body.length} notifications');

      // Debug: Print each notification
      for (int i = 0; i < body.length; i++) {
        print('🔔 Notification $i: ${body[i]}');
      }

      final notifications = body
          .map((e) => UserNotificationModel.fromJson(e))
          .toList();

      // Debug: Print parsed notifications
      for (var notification in notifications) {
        print(
          '🔔 Parsed notification: ${notification.notification?.title} - ${notification.notification?.message}',
        );
      }

      return notifications;
    } catch (e) {
      print('❌ Exception in getUserNotifications: $e');
      rethrow;
    }
  }

  @override
  Future<UserNotificationModel> markAsRead(
    int userId,
    int notificationId,
  ) async {
    try {
      print(
        '📖 Marking notification as read: userId=$userId, notificationId=$notificationId',
      );
      final response = await apiClient.put(
        '/Notification/markAsRead?userId=$userId&notificationId=$notificationId',
        {},
      );

      if (response.hasError) {
        print('❌ Failed to mark notification as read: ${response.statusText}');
        throw Exception(
          'Failed to mark notification as read: ${response.statusText}',
        );
      }

      print('✅ Successfully marked notification as read');
      return UserNotificationModel.fromJson(response.body);
    } catch (e) {
      print('❌ Exception in markAsRead: $e');
      rethrow;
    }
  }

  @override
  Future<bool> markAllAsRead(int userId) async {
    try {
      print('📖 Marking all notifications as read for user: $userId');
      final response = await apiClient.put(
        '/Notification/markAllasRead?userId=$userId',
        {},
      );

      if (response.hasError) {
        print(
          '❌ Failed to mark all notifications as read: ${response.statusText}',
        );
        throw Exception(
          'Failed to mark all notifications as read: ${response.statusText}',
        );
      }

      print('✅ Successfully marked all notifications as read');
      return response.body == true || response.body['success'] == true;
    } catch (e) {
      print('❌ Exception in markAllAsRead: $e');
      rethrow;
    }
  }
}
