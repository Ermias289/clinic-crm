import 'package:flutter/material.dart';
import 'package:get/get.dart';

/// Centralized error handling utility for consistent error message extraction and display
class ErrorHandler {
  /// Extracts user-friendly error message from API response
  ///
  /// Checks multiple possible locations for error messages:
  /// - response.body['message'] or response.body['Message']
  /// - response.body['error'] or response.body['Error']
  /// - response.statusText
  /// - response.bodyString
  static String extractErrorMessage(
    dynamic response, {
    String fallback = 'An error occurred. Please try again.',
  }) {
    try {
      // Check if response has body with message field
      if (response.body != null && response.body is Map) {
        final body = response.body as Map;

        // Try common message field names
        final message =
            body['message'] ??
            body['Message'] ??
            body['error'] ??
            body['Error'] ??
            body['msg'] ??
            body['Msg'];

        if (message != null && message is String && message.trim().isNotEmpty) {
          return message.trim();
        }
      }

      // Try statusText
      if (response.statusText != null &&
          response.statusText is String &&
          response.statusText.trim().isNotEmpty) {
        return response.statusText.trim();
      }

      // Try bodyString as last resort
      if (response.bodyString != null &&
          response.bodyString is String &&
          response.bodyString.trim().isNotEmpty) {
        final bodyStr = response.bodyString.trim();
        // Avoid showing HTML or very long strings
        if (!bodyStr.startsWith('<') && bodyStr.length < 200) {
          return bodyStr;
        }
      }
    } catch (e) {
      // Parsing failed, return fallback
    }

    return fallback;
  }

  /// Cleans exception message for user display
  ///
  /// Removes technical prefixes like "Exception: ", "Error: ", etc.
  static String cleanExceptionMessage(dynamic error) {
    String message = error.toString();

    // Remove common exception prefixes
    final prefixes = [
      'Exception: ',
      'Error: ',
      'Registration error: ',
      'Login error: ',
      'Error fetching ',
      'Error creating ',
      'Error updating ',
      'Error deleting ',
      'Failed to fetch ',
      'Failed to create ',
      'Failed to update ',
      'Failed to delete ',
    ];

    for (final prefix in prefixes) {
      if (message.startsWith(prefix)) {
        message = message.substring(prefix.length);
        break;
      }
    }

    return message.trim();
  }

  /// Gets network-aware error message
  ///
  /// Detects common network errors and provides user-friendly messages
  static String getNetworkAwareMessage(dynamic error, [dynamic response]) {
    final errorStr = error.toString().toLowerCase();

    // Check for network connectivity issues
    if (errorStr.contains('socketexception') ||
        errorStr.contains('failed host lookup') ||
        errorStr.contains('network is unreachable')) {
      return 'No internet connection. Please check your network and try again.';
    }

    // Check for timeout
    if (errorStr.contains('timeoutexception') ||
        errorStr.contains('timed out')) {
      return 'Request timed out. Please check your connection and try again.';
    }

    // Check for connection refused
    if (errorStr.contains('connection refused')) {
      return 'Unable to connect to server. Please try again later.';
    }

    // Try to extract from response if available
    if (response != null) {
      return extractErrorMessage(response);
    }

    // Clean and return the error message
    return cleanExceptionMessage(error);
  }

  /// Shows error snackbar with consistent styling
  static void showError(
    String message, {
    String title = 'Error',
    Duration? duration,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.red.shade600,
      colorText: Colors.white,
      duration: duration ?? const Duration(seconds: 4),
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      icon: const Icon(Icons.error_outline, color: Colors.white),
    );
  }

  /// Shows success snackbar with consistent styling
  static void showSuccess(
    String message, {
    String title = 'Success',
    Duration? duration,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green.shade600,
      colorText: Colors.white,
      duration: duration ?? const Duration(seconds: 3),
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      icon: const Icon(Icons.check_circle_outline, color: Colors.white),
    );
  }

  /// Shows warning snackbar with consistent styling
  static void showWarning(
    String message, {
    String title = 'Warning',
    Duration? duration,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.orange.shade600,
      colorText: Colors.white,
      duration: duration ?? const Duration(seconds: 3),
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      icon: const Icon(Icons.warning_amber_outlined, color: Colors.white),
    );
  }

  /// Shows info snackbar with consistent styling
  static void showInfo(
    String message, {
    String title = 'Info',
    Duration? duration,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.blue.shade600,
      colorText: Colors.white,
      duration: duration ?? const Duration(seconds: 3),
      margin: const EdgeInsets.all(16),
      borderRadius: 8,
      icon: const Icon(Icons.info_outline, color: Colors.white),
    );
  }

  /// Logs error for debugging (can be extended to send to error tracking service)
  static void logError(
    String context,
    dynamic error, [
    StackTrace? stackTrace,
  ]) {
    // In production, this could send to Firebase Crashlytics, Sentry, etc.
    print('ERROR [$context]: $error');
    if (stackTrace != null) {
      print('Stack trace: $stackTrace');
    }
  }

  /// Handles error by showing a snackbar with network-aware message
  static void handleError(
    dynamic error, {
    String? customTitle,
    dynamic response,
  }) {
    final message = getNetworkAwareMessage(error, response);
    showError(message, title: customTitle ?? 'Error');
  }
}
