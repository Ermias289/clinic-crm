import 'package:flutter/material.dart';

/// App color palette aligned with Ahadu Dental Clinic branding
class AppColors {
  // Primary Colors - Ahadu Black theme
  static const Color primaryBlue = Color(0xFF000000); // Ahadu Black
  static const Color primaryBlueDark = Color(0xFF000000); // Ahadu Black
  static const Color primaryBlueLight = Color(0xFF000000); // Ahadu Black

  // Accent Colors - Fountain Blue for loading and accents
  static const Color accentBlue = Color(0xFF5DADE2); // Fountain Blue
  static const Color fountainBlue = Color(
    0xFF5DADE2,
  ); // Fountain Blue for loading
  static const Color successGreen = Color(0xFF43A047); // softened green
  static const Color warningOrange = Color(0xFFF9A825); // muted orange

  // Background Colors
  static const Color backgroundLight = Color(0xFFF5F6FA);
  static const Color backgroundWhite = Color(
    0xFFE6D9EF,
  ); // soft lavender-gray (logo highlight)
  static const Color cardBackground = Color(0xFFFFFFFF);

  // Text Colors (slight refinement for readability)
  static const Color textPrimary = Color(0xFF1F1F1F);
  static const Color textSecondary = Color(0xFF6B6B6B);
  static const Color textHint = Color(0xFF9E9E9E);

  // Gradient - Ahadu Black and Fountain Blue gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [
      primaryBlue, // Ahadu Black
      Color(0xFF2C3E50), // Dark Blue-Grey for depth
      fountainBlue, // Fountain Blue
    ],
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
