import 'package:flutter/material.dart';

class OnboardingPageModel {
  final IconData icon;
  final String title;
  final String description;
  final Color? iconColor;

  OnboardingPageModel({
    required this.icon,
    required this.title,
    required this.description,
    this.iconColor,
  });
}
