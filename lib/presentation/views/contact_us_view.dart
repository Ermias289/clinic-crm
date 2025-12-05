import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../widgets/custom_button.dart';

class ContactUsView extends StatelessWidget {
  const ContactUsView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            // Header - Fully Rounded
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(24),
                boxShadow: AppColors.cardShadow,
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
                            'Contact Us',
                            style: AppTextStyles.h2.copyWith(
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Get in touch with our clinic',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.support_agent,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Phone Card
                    _buildContactCard(
                      icon: Icons.phone,
                      title: 'Phone',
                      subtitle: '+1 (555) 123-4567',
                      color: AppColors.primaryBlue,
                      onTap: () {
                        Get.snackbar('Info', 'Calling clinic...');
                      },
                    ),

                    const SizedBox(height: 16),

                    // Email Card
                    _buildContactCard(
                      icon: Icons.email,
                      title: 'Email',
                      subtitle: 'info@dentalclinic.com',
                      color: AppColors.accentBlue,
                      onTap: () {
                        Get.snackbar('Info', 'Opening email...');
                      },
                    ),

                    const SizedBox(height: 16),

                    // Location Card
                    _buildContactCard(
                      icon: Icons.location_on,
                      title: 'Address',
                      subtitle: '123 Dental Street, City, Country',
                      color: AppColors.successGreen,
                      onTap: () {
                        Get.snackbar('Info', 'Opening maps...');
                      },
                    ),

                    const SizedBox(height: 16),

                    // Working Hours Card
                    _buildContactCard(
                      icon: Icons.access_time,
                      title: 'Working Hours',
                      subtitle: 'Mon-Fri: 9:00 AM - 6:00 PM',
                      color: AppColors.warningOrange,
                      onTap: null,
                    ),

                    const SizedBox(height: 32),

                    // Emergency Contact
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.red.shade200,
                          width: 2,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.emergency,
                            size: 48,
                            color: Colors.red.shade700,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Emergency Contact',
                            style: AppTextStyles.h3.copyWith(
                              color: Colors.red.shade900,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'For dental emergencies, call:',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Colors.red.shade700,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '+1 (555) 911-DENT',
                            style: AppTextStyles.h3.copyWith(
                              color: Colors.red.shade900,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
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

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    VoidCallback? onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            boxShadow: AppColors.softShadow,
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  size: 32,
                  color: color,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: AppTextStyles.bodyLarge.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              if (onTap != null)
                Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                  color: AppColors.textHint,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
