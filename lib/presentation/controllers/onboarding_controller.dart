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
      title: 'Welcome to Dental Clinic',
      description: 'Your complete dental practice management solution',
      iconColor: AppColors.primaryBlue,
    ),
    OnboardingPageModel(
      icon: Icons.people_outline,
      title: 'Manage Patients Easily',
      description: 'Keep track of patient records, appointments, and treatment history in one place',
      iconColor: AppColors.accentBlue,
    ),
    OnboardingPageModel(
      icon: Icons.calendar_today_outlined,
      title: 'Smart Scheduling',
      description: 'Schedule and manage appointments with ease. Never miss a patient visit',
      iconColor: AppColors.successGreen,
    ),
    OnboardingPageModel(
      icon: Icons.analytics_outlined,
      title: 'Track Your Success',
      description: 'Monitor your practice performance with detailed reports and insights',
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
