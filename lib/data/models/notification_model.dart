class NotificationModel {
  final int? id;
  final String? title;
  final String? message;
  final String? type;
  final String? category;
  final DateTime? createdAt;

  NotificationModel({
    this.id,
    this.title,
    this.message,
    this.type,
    this.category,
    this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      title: json['title'],
      message: json['message'],
      type: json['type'],
      category: json['category'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'category': category,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
