import 'package:flutter/material.dart';

/// App color palette aligned with LibDentalClinic branding
class AppColors {
  // Primary Colors - Blue from logo gradient
  static const Color primaryBlue = Color(0xFF3C66B0); // Main blue from logo
  static const Color primaryBlueDark = Color(
    0xFF2E528E,
  ); // Darker blue from logo
  static const Color primaryBlueLight = Color(
    0xFF5A86C8,
  ); // Lighter blue from logo

  // Accent Colors - Teal/Cyan from logo dot
  static const Color accentTeal = Color(0xFF229FBD); // Teal accent from logo
  static const Color accentTealLight = Color(0xFF35B2CE); // Lighter teal
  static const Color accentTealDark = Color(0xFF1A8BA9); // Darker teal

  // Additional Colors
  static const Color successGreen = Color(0xFF43A047); // Success green
  static const Color warningOrange = Color(0xFFF9A825); // Warning orange

  // Background Colors
  static const Color backgroundLight = Color(0xFFF8F9FA); // Light background
  static const Color backgroundWhite = Color(0xFFFFFFFF); // Pure white
  static const Color cardBackground = Color(0xFFFFFFFF); // Card background

  // Text Colors
  static const Color textPrimary = Color(0xFF1F3A5F); // Navy blue text
  static const Color textSecondary = Color(0xFF6B6B6B); // Secondary text
  static const Color textHint = Color(0xFF9E9E9E); // Hint text

  // Gradient using brand colors from logo
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlueDark, primaryBlue, primaryBlueLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [accentTeal, accentTealLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Shadow
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
