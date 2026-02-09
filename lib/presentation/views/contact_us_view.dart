import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_routes.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/utils/image_utils.dart';
import '../../data/models/company_setting_model.dart';
import '../controllers/contact_us_controller.dart';
import '../../core/utils/error_handler.dart';

class ContactUsView extends GetView<ContactUsController> {
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
                  AppColors.primaryBlue,
                  AppColors.primaryBlueLight,
                  AppColors.accentBlue,
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
                                    color: Colors.white.withValues(alpha: 0.9),
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
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
            child: Obx(() {
              if (controller.isLoading.value) {
                return const Center(
                  child: CircularProgressIndicator(
                    color: AppColors.primaryBlue,
                  ),
                );
              }

              final setting = controller.companySetting.value;
              if (setting == null) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 60,
                        color: AppColors.textHint,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load contact information',
                        style: AppTextStyles.bodyLarge,
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: controller.refreshData,
                        child: Text(
                          'Retry',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.primaryBlue,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }

              return SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Company Logo and Name Card
                      if (setting.name?.isNotEmpty == true)
                        _buildCompanyInfoCard(setting),

                      if (setting.name?.isNotEmpty == true)
                        const SizedBox(height: 16),

                      // Phone Card
                      if (setting.phoneNumber?.isNotEmpty == true)
                        _buildContactCard(
                          icon: Icons.phone_in_talk_outlined,
                          title: 'Phone',
                          subtitle: setting.phoneNumber!,
                          onTap: () async {
                            try {
                              final Uri launchUri = Uri(
                                scheme: 'tel',
                                path: setting.phoneNumber!.replaceAll(
                                  RegExp(r'[^\d+]'),
                                  '',
                                ),
                              );
                              await launchUrl(
                                launchUri,
                                mode: LaunchMode.externalApplication,
                              );
                            } catch (e) {
                              ErrorHandler.showError('Could not launch phone dialer');
                            }
                          },
                        ),

                      if (setting.phoneNumber?.isNotEmpty == true)
                        const SizedBox(height: 8),

                      // Emergency Phone Card (separate from regular phone if available)
                      if (setting.emergencyPhoneNumber?.isNotEmpty == true)
                        _buildContactCard(
                          icon: Icons.emergency_outlined,
                          title: 'Emergency Contact',
                          subtitle: setting.emergencyPhoneNumber!,
                          isEmergency: true,
                          onTap: () async {
                            try {
                              final Uri launchUri = Uri(
                                scheme: 'tel',
                                path: setting.emergencyPhoneNumber!.replaceAll(
                                  RegExp(r'[^\d+]'),
                                  '',
                                ),
                              );
                              await launchUrl(
                                launchUri,
                                mode: LaunchMode.externalApplication,
                              );
                            } catch (e) {
                              ErrorHandler.showError('Could not launch phone dialer');
                            }
                          },
                        ),

                      if (setting.emergencyPhoneNumber?.isNotEmpty == true)
                        const SizedBox(height: 8),

                      // Email Card
                      if (setting.email?.isNotEmpty == true)
                        _buildContactCard(
                          icon: Icons.email_outlined,
                          title: 'Email',
                          subtitle: setting.email!,
                          onTap: () async {
                            try {
                              final Uri launchUri = Uri(
                                scheme: 'mailto',
                                path: setting.email!,
                              );
                              await launchUrl(
                                launchUri,
                                mode: LaunchMode.externalApplication,
                              );
                            } catch (e) {
                              ErrorHandler.showError('Could not open email app');
                            }
                          },
                        ),

                      if (setting.email?.isNotEmpty == true)
                        const SizedBox(height: 8),

                      // Address Card
                      if (setting.address?.isNotEmpty == true)
                        _buildContactCard(
                          icon: Icons.location_on_outlined,
                          title: 'Address',
                          subtitle: _buildFullAddress(setting),
                          onTap: setting.locationOnMap?.isNotEmpty == true
                              ? () async {
                                  try {
                                    // Open the locationOnMap URL directly
                                    final Uri mapsUri = Uri.parse(
                                      setting.locationOnMap!,
                                    );
                                    await launchUrl(
                                      mapsUri,
                                      mode: LaunchMode.externalApplication,
                                    );
                                  } catch (e) {
                                    ErrorHandler.showError('Could not open maps');
                                  }
                                }
                              : null,
                        ),

                      if (setting.address?.isNotEmpty == true)
                        const SizedBox(height: 8),

                      // Working Hours Card - Now using real data from API
                      _buildContactCard(
                        icon: Icons.access_time_outlined,
                        title: 'Working Hours',
                        subtitle: _buildWorkingHours(setting),
                        onTap: null, // Static info
                      ),

                      const SizedBox(height: 24),

                      // About Us Navigation Card
                      _buildContactCard(
                        icon: Icons.info_outline,
                        title: 'About Us',
                        subtitle: 'Learn more about our mission and values',
                        onTap: () {
                          Get.toNamed(Routes.aboutUs);
                        },
                      ),

                      const SizedBox(height: 16),

                      // Emergency Contact fallback (using regular phone if no emergency number)
                      if (setting.emergencyPhoneNumber?.isEmpty == true &&
                          setting.phoneNumber?.isNotEmpty == true)
                        _buildContactCard(
                          icon: Icons.emergency_outlined,
                          title: 'Emergency Contact',
                          subtitle: setting.phoneNumber!,
                          isEmergency: true,
                          onTap: () async {
                            try {
                              final Uri launchUri = Uri(
                                scheme: 'tel',
                                path: setting.phoneNumber!.replaceAll(
                                  RegExp(r'[^\d+]'),
                                  '',
                                ),
                              );
                              await launchUrl(
                                launchUri,
                                mode: LaunchMode.externalApplication,
                              );
                            } catch (e) {
                              ErrorHandler.showError('Could not launch phone dialer');
                            }
                          },
                        ),

                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildCompanyInfoCard(CompanySettingModel setting) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          children: [
            // Company Logo
            if (setting.logo?.isNotEmpty == true)
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    ImageUtils.buildImageUrl(setting.logo!),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Icon(
                        Icons.business,
                        size: 30,
                        color: AppColors.primaryBlue,
                      );
                    },
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Center(
                        child: CircularProgressIndicator(
                          color: AppColors.primaryBlue,
                          strokeWidth: 2,
                        ),
                      );
                    },
                  ),
                ),
              )
            else
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                ),
                child: Icon(
                  Icons.business,
                  size: 30,
                  color: AppColors.primaryBlue,
                ),
              ),

            const SizedBox(width: 16),

            // Company Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    setting.name ?? 'Clinic',
                    style: AppTextStyles.h2.copyWith(
                      fontSize: 20,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  if (setting.prefix?.isNotEmpty == true) ...[
                    const SizedBox(height: 4),
                    Text(
                      setting.prefix!,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ],
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
    VoidCallback? onTap,
    bool isEmergency = false,
  }) {
    final primaryColor = isEmergency
        ? Colors.red.shade700
        : AppColors.primaryBlue;
    final iconBgColor = isEmergency
        ? Colors.red.shade50
        : AppColors.primaryBlue.withValues(alpha: 0.05);

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
            padding: const EdgeInsets.symmetric(
              horizontal: 16.0,
              vertical: 12.0,
            ), // Match Service Card padding
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
                          color: isEmergency
                              ? Colors.red.shade900
                              : AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: isEmergency
                            ? AppTextStyles.h3.copyWith(
                                fontSize: 15,
                                color: Colors.red.shade700,
                              )
                            : AppTextStyles.h3.copyWith(fontSize: 15),
                      ),
                    ],
                  ),
                ),
                if (onTap != null)
                  Icon(
                    Icons
                        .arrow_forward_ios_rounded, // Rounded arrow like Services
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

  String _buildFullAddress(CompanySettingModel setting) {
    final addressParts = <String>[];

    if (setting.address?.isNotEmpty == true) {
      addressParts.add(setting.address!);
    }
    if (setting.subCity?.isNotEmpty == true) {
      addressParts.add(setting.subCity!);
    }
    if (setting.city?.isNotEmpty == true) {
      addressParts.add(setting.city!);
    }
    if (setting.country?.isNotEmpty == true) {
      addressParts.add(setting.country!);
    }

    return addressParts.join(', ');
  }

  String _buildWorkingHours(CompanySettingModel setting) {
    if (setting.workdays == null || setting.workdays!.isEmpty) {
      return 'Mon-Fri: 9:00 AM - 6:00 PM'; // Fallback
    }

    final workingDays = setting.workdays!
        .where((day) => day.isWorkingDay == true)
        .toList();

    if (workingDays.isEmpty) {
      return 'Contact us for hours';
    }

    // Group consecutive days with same hours
    final Map<String, List<String>> hourGroups = {};

    for (final day in workingDays) {
      final timeRange =
          '${_formatTime(day.openingTime)} - ${_formatTime(day.closingTime)}';
      if (hourGroups[timeRange] == null) {
        hourGroups[timeRange] = [];
      }
      hourGroups[timeRange]!.add(day.day ?? '');
    }

    // Build display string
    final List<String> hourStrings = [];
    hourGroups.forEach((timeRange, days) {
      if (days.isNotEmpty) {
        final dayRange = _formatDayRange(days);
        hourStrings.add('$dayRange: $timeRange');
      }
    });

    return hourStrings.join('\n');
  }

  String _formatTime(String? timeString) {
    if (timeString == null || timeString.isEmpty) return '';

    try {
      // Handle TimeOnly format from backend (e.g., "2:30" or "12:30")
      final parts = timeString.split(':');
      if (parts.length >= 2) {
        final hour = int.parse(parts[0]);
        final minute = int.parse(parts[1]);

        final period = hour >= 12 ? 'PM' : 'AM';
        final displayHour = hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        final displayMinute = minute == 0
            ? ''
            : ':${minute.toString().padLeft(2, '0')}';

        return '$displayHour$displayMinute $period';
      }
    } catch (e) {
      // If parsing fails, return original string
    }

    return timeString;
  }

  String _formatDayRange(List<String> days) {
    if (days.isEmpty) return '';
    if (days.length == 1) return days.first;

    // Sort days by weekday order
    final dayOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    days.sort((a, b) => dayOrder.indexOf(a).compareTo(dayOrder.indexOf(b)));

    // Check for consecutive days
    if (days.length > 2) {
      final firstIndex = dayOrder.indexOf(days.first);
      final lastIndex = dayOrder.indexOf(days.last);

      // Check if all days in between are present
      bool isConsecutive = true;
      for (int i = firstIndex; i <= lastIndex; i++) {
        if (!days.contains(dayOrder[i])) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive) {
        return '${_abbreviateDay(days.first)}-${_abbreviateDay(days.last)}';
      }
    }

    // Not consecutive, list all days
    return days.map(_abbreviateDay).join(', ');
  }

  String _abbreviateDay(String day) {
    switch (day.toLowerCase()) {
      case 'monday':
        return 'Mon';
      case 'tuesday':
        return 'Tue';
      case 'wednesday':
        return 'Wed';
      case 'thursday':
        return 'Thu';
      case 'friday':
        return 'Fri';
      case 'saturday':
        return 'Sat';
      case 'sunday':
        return 'Sun';
      default:
        return day.substring(0, 3);
    }
  }
}
