import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/dashboard_controller.dart';
import '../controllers/profile_controller.dart';
import '../widgets/dashboard_card.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../config/app_routes.dart';

class DashboardView extends GetView<DashboardController> {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<ProfileController>(
      init: Get.find<ProfileController>(),
      builder: (profileController) {
        final userName =
            profileController.currentUser.value?.fullname ??
            profileController.currentUser.value?.fName ??
            'User';

        return Scaffold(
          backgroundColor: AppColors.backgroundLight,
          body: SafeArea(
            child: Column(
              children: [
                // Header with Gradient
                Container(
                  decoration: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(32),
                      bottomRight: Radius.circular(32),
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
                  child: Column(
                    children: [
                      // Top Row - Profile and Notification
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(3),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.1),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: CircleAvatar(
                                  radius: 24,
                                  backgroundColor: AppColors.primaryBlue
                                      .withOpacity(0.1),
                                  child: Icon(
                                    Icons.person,
                                    color: AppColors.primaryBlue,
                                    size: 28,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Welcome back,',
                                    style: AppTextStyles.bodySmall.copyWith(
                                      color: Colors.white.withOpacity(0.9),
                                    ),
                                  ),
                                  Text(
                                    userName,
                                    style: AppTextStyles.h3.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          IconButton(
                            onPressed: () {
                              Get.toNamed('/profile');
                            },
                            icon: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.settings_outlined,
                                color: Colors.white,
                                size: 24,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // Quick Stats Cards
                      Row(
                        children: [
                          Expanded(
                            child: _buildStatCard(
                              icon: Icons.people_outline,
                              label: 'Patients',
                              value: '0',
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildStatCard(
                              icon: Icons.calendar_today_outlined,
                              label: 'Appointments',
                              value: '0',
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Content Section
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Section Title
                        Text(
                          'Quick Actions',
                          style: AppTextStyles.h3.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Feature Grid
                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: 1.1,
                          children: [
                            DashboardCard(
                              icon: Icons.people_outline,
                              title: 'Patients',
                              iconColor: AppColors.primaryBlue,
                              onTap: () {
                                Get.snackbar(
                                  'Coming Soon',
                                  'Patient management feature is under development',
                                  snackPosition: SnackPosition.BOTTOM,
                                  backgroundColor: AppColors.primaryBlue
                                      .withOpacity(0.1),
                                  colorText: AppColors.primaryBlue,
                                );
                              },
                            ),
                            DashboardCard(
                              icon: Icons.calendar_today_outlined,
                              title: 'Appointments',
                              iconColor: AppColors.accentTeal,
                              onTap: () {
                                Get.snackbar(
                                  'Coming Soon',
                                  'Appointment scheduling feature is under development',
                                  snackPosition: SnackPosition.BOTTOM,
                                  backgroundColor: AppColors.accentTeal
                                      .withValues(alpha: 0.1),
                                  colorText: AppColors.accentTeal,
                                );
                              },
                            ),
                            DashboardCard(
                              icon: Icons.medical_services_outlined,
                              title: 'Treatments',
                              iconColor: AppColors.successGreen,
                              onTap: () {
                                Get.snackbar(
                                  'Coming Soon',
                                  'Treatment management feature is under development',
                                  snackPosition: SnackPosition.BOTTOM,
                                  backgroundColor: AppColors.successGreen
                                      .withOpacity(0.1),
                                  colorText: AppColors.successGreen,
                                );
                              },
                            ),
                            DashboardCard(
                              icon: Icons.analytics_outlined,
                              title: 'Reports',
                              iconColor: AppColors.warningOrange,
                              onTap: () {
                                Get.snackbar(
                                  'Coming Soon',
                                  'Analytics and reports feature is under development',
                                  snackPosition: SnackPosition.BOTTOM,
                                  backgroundColor: AppColors.warningOrange
                                      .withOpacity(0.1),
                                  colorText: AppColors.warningOrange,
                                );
                              },
                            ),
                            DashboardCard(
                              icon: Icons.credit_card,
                              title: 'My Cards',
                              iconColor: AppColors.primaryBlue,
                              onTap: () => Get.toNamed(Routes.cards),
                            ),
                            DashboardCard(
                              icon: Icons.settings_outlined,
                              title: 'Settings',
                              iconColor: AppColors.textSecondary,
                              onTap: () {
                                Get.snackbar(
                                  'Coming Soon',
                                  'Settings feature is under development',
                                  snackPosition: SnackPosition.BOTTOM,
                                  backgroundColor: AppColors.textSecondary
                                      .withOpacity(0.1),
                                  colorText: AppColors.textSecondary,
                                );
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
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: AppTextStyles.h2.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: AppTextStyles.bodySmall.copyWith(
              color: color.withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }
}
