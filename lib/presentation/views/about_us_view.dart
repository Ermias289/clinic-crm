import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/about_us_controller.dart';
import '../../core/utils/error_handler.dart';

class AboutUsView extends GetView<AboutUsController> {
  const AboutUsView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          // Header Section - Top Banner Style
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  AppColors.primaryBlue,
                  AppColors.primaryBlueLight,
                  AppColors.accentTeal,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primaryBlue.withValues(alpha: 0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Decorative Circles
                Positioned(
                  top: -40,
                  right: -20,
                  child: Container(
                    width: 150,
                    height: 150,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -20,
                  left: -40,
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.08),
                    ),
                  ),
                ),

                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 16,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'About Us',
                                  style: AppTextStyles.h2.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Learn more about our mission',
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    color: Colors.white.withValues(alpha: 0.9),
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(
                                Icons.info_outline,
                                color: Colors.white,
                                size: 32,
                              ),
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

          // Content Section
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Mission Card
                  _buildInfoCard(
                    icon: Icons.flag_outlined,
                    title: 'Our Mission',
                    content:
                        'We are dedicated to providing exceptional healthcare services with a focus on innovation, compassion, and excellence. Our mission is to improve the health and well-being of our community through accessible, high-quality medical care.',
                  ),
                  const SizedBox(height: 20),

                  // Vision Card
                  _buildInfoCard(
                    icon: Icons.visibility_outlined,
                    title: 'Our Vision',
                    content:
                        'To be the leading healthcare provider in our region, recognized for our commitment to patient care, medical excellence, and innovative treatment approaches that transform lives.',
                  ),
                  const SizedBox(height: 20),

                  // Values Card
                  _buildInfoCard(
                    icon: Icons.favorite_outline,
                    title: 'Our Values',
                    content:
                        'Compassion • Excellence • Innovation • Integrity • Respect • Teamwork\n\nThese core values guide everything we do and shape our commitment to providing the best possible care for our patients.',
                  ),
                  const SizedBox(height: 20),

                  // Team Card
                  _buildInfoCard(
                    icon: Icons.group_outlined,
                    title: 'Our Team',
                    content:
                        'Our dedicated team of healthcare professionals brings together years of experience, specialized expertise, and a shared commitment to patient care. We work collaboratively to ensure every patient receives personalized, comprehensive treatment.',
                  ),
                  const SizedBox(height: 20),

                  // Services Overview Card
                  _buildInfoCard(
                    icon: Icons.medical_services_outlined,
                    title: 'What We Offer',
                    content:
                        '• Comprehensive medical consultations\n• Specialized treatment programs\n• Preventive care services\n• Emergency medical support\n• Advanced diagnostic procedures\n• Patient education and wellness programs',
                  ),
                  const SizedBox(height: 20),

                  // Developer Contact Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          AppColors.primaryBlue,
                          AppColors.primaryBlueLight,
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: AppColors.cardShadow,
                    ),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.developer_mode,
                          color: Colors.white,
                          size: 48,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Get in Touch with Developer',
                          style: AppTextStyles.h3.copyWith(color: Colors.white),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Developed by Nexa Business Group',
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'We are a leading technology solutions provider specializing in innovative mobile and web applications. Our team is dedicated to creating cutting-edge digital experiences that transform businesses and improve user engagement.',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: Colors.white.withValues(alpha: 0.9),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),

                        // Contact Information
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              // Phone Numbers
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.2,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.phone_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Phone',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white.withValues(
                                                  alpha: 0.8,
                                                ),
                                              ),
                                        ),
                                        Text(
                                          '+251-911-343-831',
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                        Text(
                                          '+251-911-984-806',
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              // Email Field
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.2,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.email_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Email',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white.withValues(
                                                  alpha: 0.8,
                                                ),
                                              ),
                                        ),
                                        Text(
                                          'info@nexabusinessgroup.com',
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              // Website Field
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.2,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.language_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Website',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white.withValues(
                                                  alpha: 0.8,
                                                ),
                                              ),
                                        ),
                                        Text(
                                          'www.nexabusinessgroup.com',
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              // Location Field
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.2,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.location_on_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Location',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white.withValues(
                                                  alpha: 0.8,
                                                ),
                                              ),
                                        ),
                                        Text(
                                          'Eden Bldg, 4th floor, Office No. 01,\nBole Rwanda St., Addis Ababa',
                                          style: AppTextStyles.bodyMedium
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () async {
                            // Launch the Nexa Business Group website
                            try {
                              final Uri url = Uri.parse(
                                'https://www.nexabusinessgroup.com',
                              );
                              await launchUrl(
                                url,
                                mode: LaunchMode.externalApplication,
                              );
                            } catch (e) {
                              // Show error message if URL can't be launched
                            } catch (e) {
                              // Show error message if URL can't be launched
                              ErrorHandler.showError('Could not launch website. Please check your internet connection.');
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.primaryBlue,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 32,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25),
                            ),
                          ),
                          child: Text(
                            'Contact Developer',
                            style: AppTextStyles.button.copyWith(
                              color: AppColors.primaryBlue,
                            ),
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
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: AppColors.primaryBlue, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(child: Text(title, style: AppTextStyles.h3)),
            ],
          ),
          const SizedBox(height: 16),
          Text(content, style: AppTextStyles.bodyMedium.copyWith(height: 1.6)),
        ],
      ),
    );
  }
}
