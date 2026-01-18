import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../config/app_routes.dart';
import '../controllers/notification_controller.dart';

class NotificationBadge extends StatelessWidget {
  final Color? iconColor;
  final Color? backgroundColor;
  final double? iconSize;
  final bool showBackground;

  const NotificationBadge({
    super.key,
    this.iconColor,
    this.backgroundColor,
    this.iconSize = 24,
    this.showBackground = true,
  });

  @override
  Widget build(BuildContext context) {
    return GetBuilder<NotificationController>(
      init: Get.find<NotificationController>(),
      builder: (controller) {
        return Stack(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: showBackground
                  ? BoxDecoration(
                      color:
                          backgroundColor ??
                          Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    )
                  : null,
              child: InkWell(
                onTap: () => Get.toNamed(Routes.notifications),
                child: Icon(
                  Icons.notifications_outlined,
                  color: iconColor ?? Colors.white,
                  size: iconSize,
                ),
              ),
            ),
            // Unread count badge
            Obx(() {
              if (controller.unreadCount.value > 0) {
                return Positioned(
                  right: showBackground ? 4 : 0,
                  top: showBackground ? 4 : 0,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 12,
                      minHeight: 12,
                    ),
                    child: Text(
                      controller.unreadCount.value > 9
                          ? '9+'
                          : controller.unreadCount.value.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                );
              }
              return const SizedBox();
            }),
          ],
        );
      },
    );
  }
}
