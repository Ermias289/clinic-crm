import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/dashboard_controller.dart';
import '../widgets/dashboard_card.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class DashboardView extends GetView<DashboardController> {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              decoration: const BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(24),
                  bottomRight: Radius.circular(24),
                ),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Dashboard",
                            style: AppTextStyles.h2.copyWith(
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Welcome back!",
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        child: const Icon(
                          Icons.person,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  children: [
                    DashboardCard(
                      icon: Icons.people_outline,
                      title: 'Patients',
                      iconColor: AppColors.primaryBlue,
                      onTap: () {
                        Get.snackbar('Info', 'Patients feature coming soon');
                      },
                    ),
                    DashboardCard(
                      icon: Icons.calendar_today_outlined,
                      title: 'Appointments',
                      iconColor: AppColors.accentBlue,
                      onTap: () {
                        Get.snackbar('Info', 'Appointments feature coming soon');
                      },
                    ),
                    DashboardCard(
                      icon: Icons.medical_services_outlined,
                      title: 'Treatments',
                      iconColor: AppColors.successGreen,
                      onTap: () {
                        Get.snackbar('Info', 'Treatments feature coming soon');
                      },
                    ),
                    DashboardCard(
                      icon: Icons.analytics_outlined,
                      title: 'Reports',
                      iconColor: AppColors.warningOrange,
                      onTap: () {
                        Get.snackbar('Info', 'Reports feature coming soon');
                      },
                    ),
                    DashboardCard(
                      icon: Icons.settings_outlined,
                      title: 'Settings',
                      iconColor: AppColors.textSecondary,
                      onTap: () {
                        Get.snackbar('Info', 'Settings feature coming soon');
                      },
                    ),
                    DashboardCard(
                      icon: Icons.logout,
                      title: 'Logout',
                      iconColor: Colors.red.shade400,
                      onTap: controller.logout,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
