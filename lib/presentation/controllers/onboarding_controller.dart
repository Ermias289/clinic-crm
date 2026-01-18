import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/models/onboarding_page_model.dart';
import '../../core/theme/app_colors.dart';

class OnboardingController extends GetxController {
  final box = GetStorage();
  final pageController = PageController();
  final currentPage = 0.obs;

  final List<OnboardingPageModel> pages = [
    OnboardingPageModel(
      icon: Icons.medical_services_rounded,
      title: 'Welcome to Ahadu Dental Clinic',
      description:
          'Experience exceptional dental care with our state-of-the-art facility and expert team',
      iconColor: AppColors.primaryBlue,
    ),
    OnboardingPageModel(
      icon: Icons.people_outline,
      title: 'Personalized Patient Care',
      description:
          'At Ahadu, we provide individualized treatment plans tailored to your unique dental needs',
      iconColor: AppColors.accentBlue,
    ),
    OnboardingPageModel(
      icon: Icons.calendar_today_outlined,
      title: 'Easy Appointment Booking',
      description:
          'Schedule your visits at Ahadu Dental Clinic with our convenient online booking system',
      iconColor: AppColors.successGreen,
    ),
    OnboardingPageModel(
      icon: Icons.analytics_outlined,
      title: 'Track Your Dental Health',
      description:
          'Monitor your treatment progress and maintain optimal oral health with Ahadu\'s comprehensive care',
      iconColor: AppColors.warningOrange,
    ),
  ];

  @override
  void onInit() {
    super.onInit();
    pageController.addListener(() {
      currentPage.value = pageController.page?.round() ?? 0;
    });
  }

  void nextPage() {
    if (currentPage.value < pages.length - 1) {
      pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      completeOnboarding();
    }
  }

  void skipOnboarding() {
    completeOnboarding();
  }

  void completeOnboarding() {
    box.write('onboarding_complete', true);
    Get.offAllNamed('/login');
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }
}
