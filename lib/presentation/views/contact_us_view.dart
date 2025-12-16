import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:url_launcher/url_launcher.dart';
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
                    Color(0xFF0D47A1),
                    Color(0xFF1565C0),
                    Color(0xFF1976D2),
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
                    color: AppColors.primaryBlue.withOpacity(0.3),
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
                        color: Colors.white.withOpacity(0.1),
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
                        color: Colors.white.withOpacity(0.08),
                      ),
                    ),
                  ),
                  
                  SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
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
                                    'Contact Us',
                                    style: AppTextStyles.h2.copyWith(
                                      color: Colors.white,
                                      fontSize: 28,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Get in touch with our clinic',
                                    style: AppTextStyles.bodyMedium.copyWith(
                                      color: Colors.white.withOpacity(0.9),
                                      fontSize: 16,
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

            // Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                  // Phone Card
                  _buildContactCard(
                    icon: Icons.phone_in_talk_outlined,
                    title: 'Phone',
                    subtitle: '+1 (555) 123-4567',
                    onTap: () async {
                       final Uri launchUri = Uri(
                        scheme: 'tel',
                        path: '+15551234567',
                      );
                      if (await canLaunchUrl(launchUri)) {
                        await launchUrl(launchUri);
                      } else {
                        Get.snackbar('Error', 'Could not launch phone dialer');
                      }
                    },
                  ),

                  const SizedBox(height: 8),

                  // Email Card
                  _buildContactCard(
                    icon: Icons.email_outlined,
                    title: 'Email',
                    subtitle: 'info@dentalclinic.com',
                    onTap: () async {
                      final Uri launchUri = Uri(
                        scheme: 'mailto',
                        path: 'info@dentalclinic.com',
                        query: 'subject=Inquiry&body=Hello,', 
                      );
                      if (await canLaunchUrl(launchUri)) {
                        await launchUrl(launchUri);
                      } else {
                        Get.snackbar('Error', 'Could not open email app');
                      }
                    },
                  ),

                  const SizedBox(height: 8),

                  // Location Card
                  _buildContactCard(
                    icon: Icons.location_on_outlined,
                    title: 'Address',
                    subtitle: '123 Dental Street, City, Country',
                    onTap: () {
                      // Integration with Maps is typically done via 'geo:' or Google Maps URL scheme.
                      // For now, keeping it simple as requested or maybe 'geo:0,0?q=address'
                       Get.snackbar('Info', 'Maps integration coming soon');
                    },
                  ),

                  const SizedBox(height: 8),

                  // Working Hours Card
                  _buildContactCard(
                    icon: Icons.access_time_outlined,
                    title: 'Working Hours',
                    subtitle: 'Mon-Fri: 9:00 AM - 6:00 PM',
                    onTap: null, // Static info
                  ),

                  const Spacer(),

                  // Emergency Contact
                  _buildContactCard(
                    icon: Icons.emergency_outlined,
                    title: 'Emergency Contact',
                    subtitle: '+1 (555) 911-DENT',
                    isEmergency: true,
                    onTap: () async {
                       final Uri launchUri = Uri(
                        scheme: 'tel',
                        path: '+15559113368', // Dummy emergency number
                      );
                      if (await canLaunchUrl(launchUri)) {
                        await launchUrl(launchUri);
                      } else {
                        Get.snackbar('Error', 'Could not launch phone dialer');
                      }
                    },
                  ),
                  
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
    bool isEmergency = false,
  }) {
    final primaryColor = isEmergency ? Colors.red.shade700 : AppColors.primaryBlue;
    final iconBgColor = isEmergency ? Colors.red.shade50 : AppColors.primaryBlue.withOpacity(0.05);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16), // Match Service Card radius
        boxShadow: AppColors.softShadow, // Match Service Card shadow
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0), // Match Service Card padding
            child: Row(
              children: [
                Container(
                  width: 48, // Match Service Card icon size
                  height: 48,
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    size: 24, // Match Service Card icon size
                    color: primaryColor,
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
                            color: isEmergency ? Colors.red.shade900 : AppColors.textSecondary
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: isEmergency 
                            ? AppTextStyles.h3.copyWith(fontSize: 15, color: Colors.red.shade700)
                            : AppTextStyles.h3.copyWith(fontSize: 15),
                      ),
                    ],
                  ),
                ),
                if (onTap != null)
                  Icon(
                    Icons.arrow_forward_ios_rounded, // Rounded arrow like Services
                    size: 14,
                    color: AppColors.textHint,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
