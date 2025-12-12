import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/card_controller.dart';
import 'dart:io';

class RequestCardPaymentView extends GetView<CardController> {
  const RequestCardPaymentView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(24),
                boxShadow: AppColors.cardShadow,
              ),
              padding: const EdgeInsets.all(24),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Get.back(),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Payment',
                        style: AppTextStyles.h2.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Step 2: Bank Transfer & Proof',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: Colors.white.withOpacity(0.9),
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
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Bank Details Card
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E1E1E),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 15,
                            offset: const Offset(0, 8),
                          ),
                        ],
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            const Color(0xFF2C3E50),
                            const Color(0xFF000000),
                          ],
                        ),
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Bank Transfer',
                                style: AppTextStyles.bodySmall.copyWith(color: Colors.white70),
                              ),
                              Icon(Icons.account_balance, color: Colors.white70),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            '1000 2345 6789 0000',
                            style: AppTextStyles.h3.copyWith(
                              color: Colors.white,
                              letterSpacing: 2,
                              fontFamily: 'Courier',
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Account Name', style: AppTextStyles.bodySmall.copyWith(color: Colors.white70)),
                                  const SizedBox(height: 4),
                                  Text('Clinic CRM Ltd', style: AppTextStyles.bodyMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              const Spacer(),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Bank', style: AppTextStyles.bodySmall.copyWith(color: Colors.white70)),
                                  const SizedBox(height: 4),
                                  Text('CBE', style: AppTextStyles.bodyMedium.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Order Summary
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Card Type', style: AppTextStyles.bodySmall),
                              Obx(() => Text(
                                controller.selectedCard.value?.cardType?.name ?? 'N/A',
                                style: AppTextStyles.h3.copyWith(color: AppColors.primaryBlue),
                              )),
                            ],
                          ),
                          const Divider(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Patient', style: AppTextStyles.bodySmall),
                              Text(
                                '${controller.fNameController.text} ${controller.lNameController.text}',
                                style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Amount to Pay', style: AppTextStyles.bodySmall),
                              Obx(() => Text(
                                '\$${controller.selectedCard.value?.price?.toStringAsFixed(2) ?? "0.00"}',
                                style: AppTextStyles.h3.copyWith(color: Colors.green),
                              )),
                            ],
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    Text(
                      'Payment Proof',
                      style: AppTextStyles.h3.copyWith(color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 12),
                    
                    // Image Upload Area - Smaller
                    GestureDetector(
                      onTap: controller.pickPaymentProof,
                      child: Obx(() {
                        return Container(
                          height: 120, // Smaller height
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: AppColors.primaryBlue.withOpacity(0.3),
                              width: 2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: controller.selectedPaymentProof.value != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(14),
                                  child: Image.file(
                                    controller.selectedPaymentProof.value!,
                                    fit: BoxFit.cover,
                                  ),
                                )
                              : Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.image_outlined, // Changed icon
                                      size: 28,
                                      color: AppColors.textSecondary,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Click to attach receipt',
                                      style: AppTextStyles.bodySmall.copyWith(
                                        color: AppColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                        );
                      }),
                    ),

                    const Spacer(), // Pushes button to bottom

                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: Obx(() => ElevatedButton(
                        onPressed: controller.isLoading.value ? null : controller.submitRequest,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                        ),
                        child: controller.isLoading.value
                            ? const CircularProgressIndicator(color: Colors.white)
                            : Text(
                                'Submit Request',
                                style: AppTextStyles.h3.copyWith(color: Colors.white),
                              ),
                      )),
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
