import 'notification_model.dart';

class UserNotificationModel {
  final int? id;
  final int? userId;
  final int? notificationId;
  final bool? isRead;
  final DateTime? readAt;
  final NotificationModel? notification;

  UserNotificationModel({
    this.id,
    this.userId,
    this.notificationId,
    this.isRead,
    this.readAt,
    this.notification,
  });

  factory UserNotificationModel.fromJson(Map<String, dynamic> json) {
    return UserNotificationModel(
      id: json['id'],
      userId: json['userId'],
      notificationId: json['notificationId'],
      isRead: json['isRead'] ?? false,
      readAt: json['readAt'] != null ? DateTime.parse(json['readAt']) : null,
      notification: json['notification'] != null
          ? NotificationModel.fromJson(json['notification'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'notificationId': notificationId,
      'isRead': isRead,
      'readAt': readAt?.toIso8601String(),
      'notification': notification?.toJson(),
    };
  }
}
