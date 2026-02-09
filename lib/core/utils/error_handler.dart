import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ErrorHandler {
  static void handleError(Object error, {String? customTitle}) {
    String message = error.toString();

    // Clean up common exception prefixes
    if (message.startsWith('Exception: ')) {
      message = message.substring(11);
    } else if (message.startsWith('Error: ')) {
      message = message.substring(7);
    }

    // User-friendly mapping for common technical errors
    if (message.contains('SocketException') || 
        message.contains('Connection refused') || 
        message.contains('Network is unreachable')) {
      message = 'Please check your internet connection.';
    } else if (message.contains('TimeoutException')) {
      message = 'The server is taking too long to respond. Please try again.';
    } else if (message.contains('401') || message.contains('Unauthorized')) {
      message = 'Session expired. Please login again.';
    } else if (message.contains('403') || message.contains('Forbidden')) {
      message = 'You do not have permission to perform this action.';
    } else if (message.contains('404') || message.contains('Not Found')) {
      message = 'The requested resource was not found.';
    } else if (message.contains('500') || message.contains('Internal Server Error')) {
      message = 'Something went wrong on our end. Please try again later.';
    }

    showError(message, title: customTitle);
  }

  static void showError(String message, {String? title}) {
    if (Get.isSnackbarOpen) {
      Get.closeCurrentSnackbar();
    }
    
    Get.snackbar(
      title ?? 'Error',
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.red.shade100,
      colorText: Colors.red.shade900,
      icon: Icon(Icons.error_outline, color: Colors.red.shade900),
      margin: const EdgeInsets.all(10),
      borderRadius: 8,
      duration: const Duration(seconds: 4),
      isDismissible: true,
    );
  }

  static void showSuccess(String message, {String? title}) {
    if (Get.isSnackbarOpen) {
      Get.closeCurrentSnackbar();
    }

    Get.snackbar(
      title ?? 'Success',
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green.shade100,
      colorText: Colors.green.shade900,
      icon: Icon(Icons.check_circle_outline, color: Colors.green.shade900),
      margin: const EdgeInsets.all(10),
      borderRadius: 8,
      duration: const Duration(seconds: 3),
      isDismissible: true,
    );
  }
}
