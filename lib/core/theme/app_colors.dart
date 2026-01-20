import 'package:flutter/material.dart';

/// App color palette aligned with True Care Dental and Implant Clinic branding
class AppColors {
  // Primary Colors - Navy Blue (#1F3A5F)
  static const Color primaryBlue = Color(0xFF1F3A5F); // Navy Blue
  static const Color primaryBlueDark = Color(0xFF152B47); // Darker Navy
  static const Color primaryBlueLight = Color(0xFF2A4A77); // Lighter Navy

  // Accent Colors - Mint Green (#7CB342)
  static const Color accentGreen = Color(0xFF7CB342); // Mint Green
  static const Color accentGreenLight = Color(0xFF8BC34A); // Lighter Mint
  static const Color accentGreenDark = Color(0xFF689F38); // Darker Mint

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

  // Gradient using brand colors
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue, primaryBlueLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [accentGreen, accentGreenLight],
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
