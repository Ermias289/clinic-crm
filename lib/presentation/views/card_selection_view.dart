import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/card_controller.dart';
import '../controllers/profile_controller.dart';
import '../../data/models/card_setting_model.dart'; // Import for CardSettingModel type

class CardSelectionView extends GetView<CardController> {
  const CardSelectionView({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible and match other pages
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
                                  'Select a Card',
                                  style: AppTextStyles.h2.copyWith(
                                    color: Colors.white,
                                    fontSize: 28,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Choose a card to request',
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    color: Colors.white.withOpacity(0.9),
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Powered by Nexa',
                                  style: AppTextStyles.bodySmall.copyWith(
                                    color: Colors.white.withOpacity(0.85),
                                    fontSize: 12,
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
                                Icons.credit_card,
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
                return const Center(child: CircularProgressIndicator());
              }

              if (controller.cardSettings.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.credit_card_off,
                        size: 64,
                        color: AppColors.textSecondary.withOpacity(0.5),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No cards available at the moment.',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 8,
                ),
                itemCount: controller.cardSettings.length,
                itemBuilder: (context, index) {
                  // if (index == controller.cardSettings.length) {
                  //   return Padding(
                  //     padding: const EdgeInsets.only(top: 8, bottom: 16),
                  //     child: Center(
                  //       child: Text(
                  //         'Powered by Nexa',
                  //         style: AppTextStyles.bodySmall.copyWith(
                  //           color: AppColors.textSecondary,
                  //         ),
                  //       ),
                  //     ),
                  //   );
                  // }
                  final card = controller.cardSettings[index];
                  return _buildCardItem(card);
                },
              );
            }),
          ),
        ],
      ),
    );
  }

  LinearGradient _getCardGradient(String? cardTypeName) {
    final name = cardTypeName?.toLowerCase();
    if (name == 'platinum') {
      return const LinearGradient(
        colors: [Color(0xFF1a1a1a), Color(0xFF333333), Color(0xFF4d4d4d)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    } else if (name == 'gold') {
      return const LinearGradient(
        colors: [Color(0xFFFFD700), Color(0xFFFFB347), Color(0xFFFFA500)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    } else {
      return const LinearGradient(
        colors: [Color(0xFFE8E8E8), Color(0xFFC0C0C0), Color(0xFFA8A8A8)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    }
  }

  Widget _buildCardItem(CardSettingModel card) {
    return Obx(() {
      final profileController = Get.find<ProfileController>();
      // Use reactive user data with better fallback and loading state
      final isLoading = profileController.isLoading.value;
      final userName =
          profileController.currentUser.value?.fullname ??
          profileController.currentUser.value?.fName ??
          (isLoading ? 'Loading...' : 'User');
      final userEmail =
          profileController.currentUser.value?.email ??
          (isLoading ? 'Loading...' : 'user@example.com');
      final expiryDate = DateFormat(
        'MM/yy',
      ).format(DateTime.now().add(Duration(days: card.expirationDuration)));
      final maskedCardNumber = '**** **** **** 1234';

      return Container(
        margin: const EdgeInsets.only(bottom: 16),
        child: Column(
          children: [
            // Card Preview
            Container(
              height: 240,
              decoration: BoxDecoration(
                gradient: _getCardGradient(card.cardType?.name),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Decorative Circles
                  Positioned(
                    top: -30,
                    right: -30,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.1),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -20,
                    left: -20,
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.05),
                      ),
                    ),
                  ),
                  // Content
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Top Row: Icon and Subscription Text
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Icon(
                              Icons.medical_services,
                              color: Colors.white,
                              size: 32,
                            ),
                            Text(
                              '${card.cardType?.name ?? 'CLINIC'} SUBSCRIPTION',
                              style: AppTextStyles.bodySmall.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        const Spacer(),
                        // Center: User Name and Card Number
                        Text(
                          userName,
                          style: AppTextStyles.h3.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          maskedCardNumber,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: Colors.white,
                            letterSpacing: 2,
                          ),
                        ),
                        const Spacer(),
                        // Bottom: Expiry, Email, and Request Button
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'EXP $expiryDate',
                                  style: AppTextStyles.caption.copyWith(
                                    color: Colors.white,
                                    fontSize: 10,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  userEmail,
                                  style: AppTextStyles.caption.copyWith(
                                    color: Colors.white,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                            // Request Button inside card
                            ElevatedButton(
                              onPressed: () => controller.startRequest(card),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primaryBlue,
                                foregroundColor: Colors.white,
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                              ),
                              child: const Text(
                                'Request',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    });
  }
}
