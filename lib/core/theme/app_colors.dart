import 'package:flutter/material.dart';

/// App color palette aligned with AD Dental Clinic branding
class AppColors {
  // Primary Colors - Deep Blue theme
  static const Color primaryBlue = Color(0xFF0A3656); // Main deep blue color
  static const Color primaryBlueDark = Color(0xFF072638); // Darker blue
  static const Color primaryBlueLight = Color(0xFF0E4A75); // Lighter blue

  // Accent Colors - Orange
  static const Color accentBlue = Color(0xFFE57725); // Orange accent
  static const Color successGreen = Color(0xFF43A047); // softened green
  static const Color warningOrange = Color(0xFFF9A825); // muted orange

  // Background Colors
  static const Color backgroundLight = Color(
    0xFFF5F8FA,
  ); // Very light blue tint
  static const Color backgroundWhite = Color(0xFFFFFFFF); // Pure white
  static const Color cardBackground = Color(0xFFFFFFFF);

  // Text Colors
  static const Color textPrimary = Color(0xFF1F1F1F);
  static const Color textSecondary = Color(0xFF6B6B6B);
  static const Color textHint = Color(0xFF9E9E9E);

  // Gradient - Deep Blue to Orange
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue, accentBlue],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Shadow (softened)
  static List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 12,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> softShadow = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.04),
      blurRadius: 8,
      offset: const Offset(0, 2),
    ),
  ];
}
