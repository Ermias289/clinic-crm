import 'package:flutter/material.dart';

/// App color palette aligned with Seid Dental Clinic branding
class AppColors {
  // Primary Colors - Seid White Blue theme
  static const Color primaryBlue = Color(0xFF2196F3); // Seid Blue
  static const Color primaryBlueDark = Color(0xFF1976D2); // Seid Blue Dark
  static const Color primaryBlueLight = Color(0xFF64B5F6); // Seid Blue Light

  // Accent Colors - Fountain Blue for loading and accents
  static const Color accentBlue = Color(0xFF5DADE2); // Fountain Blue
  static const Color fountainBlue = Color(
    0xFF5DADE2,
  ); // Fountain Blue for loading
  static const Color successGreen = Color(0xFF43A047); // softened green
  static const Color warningOrange = Color(0xFFF9A825); // muted orange

  // Background Colors
  static const Color backgroundLight = Color(0xFFF8FAFE); // Light blue tint
  static const Color backgroundWhite = Color(0xFFFFFFFF); // Pure white
  static const Color cardBackground = Color(0xFFFFFFFF);

  // Text Colors (slight refinement for readability)
  static const Color textPrimary = Color(0xFF1F1F1F);
  static const Color textSecondary = Color(0xFF6B6B6B);
  static const Color textHint = Color(0xFF9E9E9E);

  // Gradient - White Blue gradient for Seid theme
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [
      Color(0xFFFFFFFF), // White
      Color(0xFF2196F3), // Seid Blue
    ],
    stops: [0.0, 1.0],
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
