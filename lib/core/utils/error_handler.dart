import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ErrorHandler {
  static void handleError(Object error, {String? customTitle}) {
    String message = _getUserFriendlyMessage(error);
    showError(message, title: customTitle);
  }

  static String _getUserFriendlyMessage(Object error) {
    String message = error.toString();

    // Clean up common exception prefixes
    if (message.startsWith('Exception: ')) {
      message = message.substring(11);
    } else if (message.startsWith('Error: ')) {
      message = message.substring(7);
    }

    // Network errors
    if (message.contains('SocketException') ||
        message.contains('Connection refused') ||
        message.contains('Network is unreachable') ||
        message.contains('Failed host lookup') ||
        message.contains('No address associated with hostname')) {
      return 'Please check your internet connection and try again.';
    }

    if (message.contains('TimeoutException') || message.contains('timed out')) {
      return 'The request is taking too long. Please try again.';
    }

    // Authentication errors
    if (message.contains('401') || message.contains('Unauthorized')) {
      return 'Your session has expired. Please login again.';
    }

    if (message.contains('403') || message.contains('Forbidden')) {
      return 'You do not have permission to perform this action.';
    }

    // Resource errors
    if (message.contains('404') || message.contains('Not Found')) {
      return 'The requested information could not be found.';
    }

    // Server errors
    if (message.contains('500') ||
        message.contains('Internal Server Error') ||
        message.contains('502') ||
        message.contains('503') ||
        message.contains('Bad Gateway') ||
        message.contains('Service Unavailable')) {
      return 'Something went wrong on our end. Please try again later.';
    }

    // Validation errors
    if (message.contains('validation') ||
        message.contains('invalid') ||
        message.contains('required field')) {
      return 'Please check your information and try again.';
    }

    // Data format errors
    if (message.contains('FormatException') ||
        message.contains('Unexpected response format') ||
        message.contains('Failed to parse') ||
        message.contains('type \'Null\' is not a subtype')) {
      return 'We received unexpected data. Please try again.';
    }

    // Token/authentication errors
    if (message.contains('token') || message.contains('Token')) {
      return 'Your session has expired. Please login again.';
    }

    // Generic API errors - hide technical details
    if (message.contains('Error fetching') ||
        message.contains('Error creating') ||
        message.contains('Error updating') ||
        message.contains('Error deleting') ||
        message.contains('Failed to fetch') ||
        message.contains('Failed to create') ||
        message.contains('Failed to update') ||
        message.contains('Failed to delete') ||
        message.contains('statusText') ||
        message.contains('bodyString') ||
        message.contains('statusCode')) {
      return 'Unable to complete your request. Please try again.';
    }

    // If no specific mapping found, return a generic friendly message
    // instead of exposing technical details
    return 'Something went wrong. Please try again.';
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
