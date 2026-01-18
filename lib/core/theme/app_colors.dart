import 'package:flutter/material.dart';

/// App color palette aligned with Lucid Dental branding
class AppColors {
  // Primary Colors (kept names, adjusted values)
  static const Color primaryBlue = Color.fromARGB(255, 81, 7, 113);
  static const Color primaryBlueDark = Color.fromARGB(255, 50, 7, 84);
  static const Color primaryBlueLight = Color.fromARGB(255, 110, 2, 143);

  // Accent Colors (adjusted to not fight brand)
  static const Color accentBlue = Color.fromARGB(
    255,
    135,
    80,
    170,
  ); // soft purple accent
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

  // Gradient (unchanged structure)
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue, primaryBlueLight],
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
