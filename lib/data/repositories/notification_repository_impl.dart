import '../datasources/notification_remote_data_source.dart';
import '../models/user_notification_model.dart';
import '../../domain/repositories/notification_repository.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  final NotificationRemoteDataSource remoteDataSource;

  NotificationRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<UserNotificationModel>> getUserNotifications(int userId) async {
    return await remoteDataSource.getUserNotifications(userId);
  }

  @override
  Future<UserNotificationModel> markAsRead(
    int userId,
    int notificationId,
  ) async {
    return await remoteDataSource.markAsRead(userId, notificationId);
  }

  @override
  Future<bool> markAllAsRead(int userId) async {
    return await remoteDataSource.markAllAsRead(userId);
  }
}
