import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/payment_controller.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../data/models/payment_model.dart';
import '../../core/utils/image_utils.dart';

class PaymentHistoryView extends GetView<PaymentController> {
  const PaymentHistoryView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Payment History', style: AppTextStyles.h2),
        backgroundColor: AppColors.primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
          onPressed: () => Get.back(),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.primaryBlue),
          );
        }

        if (controller.error.value.isNotEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.textHint,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load payment history',
                    style: AppTextStyles.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    controller.error.value,
                    style: AppTextStyles.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => controller.refreshPayments(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }

        if (controller.payments.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.payment_outlined,
                    size: 64,
                    color: AppColors.textHint,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No payment history found',
                    style: AppTextStyles.bodyLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Your payment transactions will appear here',
                    style: AppTextStyles.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => controller.refreshPayments(),
          color: AppColors.primaryBlue,
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: controller.payments.length,
            itemBuilder: (context, index) {
              final payment = controller.payments[index];
              return _buildPaymentCard(payment);
            },
          ),
        );
      }),
    );
  }

  Widget _buildPaymentCard(PaymentModel payment) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.cardShadow,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with reference and status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    payment.reference,
                    style: AppTextStyles.h3.copyWith(fontSize: 16),
                  ),
                ),
                _buildStatusBadge(payment.status),
              ],
            ),
            const SizedBox(height: 12),

            // Card number
            if (payment.card != null)
              Row(
                children: [
                  Icon(
                    Icons.credit_card,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    payment.card!.cardNumber,
                    style: AppTextStyles.bodyMedium,
                  ),
                ],
              ),
            const SizedBox(height: 8),

            // Amount information
            Row(
              children: [
                Icon(
                  Icons.attach_money,
                  size: 16,
                  color: AppColors.textSecondary,
                ),
                const SizedBox(width: 8),
                Text(
                  'Expected: ${controller.formatAmount(payment.expectedAmount)}',
                  style: AppTextStyles.bodyMedium,
                ),
              ],
            ),
            const SizedBox(height: 4),

            Row(
              children: [
                const SizedBox(width: 24),
                Text(
                  'Paid: ${controller.formatAmount(payment.paidAmount)}',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: payment.paidAmount > 0
                        ? AppColors.successGreen
                        : AppColors.textSecondary,
                  ),
                ),
              ],
            ),

            if (payment.unPaidAmount > 0) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  const SizedBox(width: 24),
                  Text(
                    'Unpaid: ${controller.formatAmount(payment.unPaidAmount)}',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.warningOrange,
                    ),
                  ),
                ],
              ),
            ],

            const SizedBox(height: 12),

            // Date information
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 16,
                  color: AppColors.textSecondary,
                ),
                const SizedBox(width: 8),
                Text(
                  'Created: ${controller.formatDate(payment.createdAt)}',
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),

            if (payment.approvedAt != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  const SizedBox(width: 24),
                  Text(
                    'Approved: ${controller.formatDate(payment.approvedAt)}',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.successGreen,
                    ),
                  ),
                ],
              ),
            ],

            // Insurance coverage
            if (payment.isInsuranceCovered) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(
                    Icons.verified_user,
                    size: 16,
                    color: AppColors.successGreen,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Insurance Covered',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.successGreen,
                    ),
                  ),
                ],
              ),
            ],

            // Remarks (if any)
            if (payment.approvalRemark.isNotEmpty &&
                payment.status.toLowerCase() == 'approved') ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.successGreen.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.comment,
                      size: 14,
                      color: AppColors.successGreen,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        payment.approvalRemark,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.successGreen,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            if (payment.rejectionRemark.isNotEmpty &&
                payment.status.toLowerCase() == 'rejected') ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, size: 14, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        payment.rejectionRemark,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: Colors.red,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            // Payment Proof Image (exclude AUTO-PREPARE status)
            if (payment.paymentProof.isNotEmpty && 
                payment.status.toLowerCase() != 'auto-prepared') ...[
              const SizedBox(height: 12),
              Text(
                'Payment Proof',
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: () => _showPaymentProofDialog(payment.paymentProof),
                child: Container(
                  width: double.infinity,
                  height: 150,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.primaryBlue.withValues(alpha: 0.3),
                      width: 1,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(11),
                    child: Image.network(
                      ImageUtils.buildImageUrl(payment.paymentProof),
                      fit: BoxFit.cover,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Container(
                          color: AppColors.backgroundLight,
                          child: Center(
                            child: CircularProgressIndicator(
                              color: AppColors.primaryBlue,
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      loadingProgress.expectedTotalBytes!
                                  : null,
                            ),
                          ),
                        );
                      },
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: AppColors.backgroundLight,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.broken_image_outlined,
                                size: 32,
                                color: AppColors.textHint,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Failed to load image',
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textHint,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Tap to view full size',
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color backgroundColor;
    Color textColor;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'approved':
        backgroundColor = AppColors.successGreen;
        textColor = Colors.white;
        icon = Icons.check_circle;
        break;
      case 'pending':
      case 'auto-prepared':
        backgroundColor = AppColors.warningOrange;
        textColor = Colors.white;
        icon = Icons.schedule;
        break;
      case 'rejected':
        backgroundColor = Colors.red;
        textColor = Colors.white;
        icon = Icons.cancel;
        break;
      case 'canceled':
        backgroundColor = AppColors.textHint;
        textColor = Colors.white;
        icon = Icons.block;
        break;
      default:
        backgroundColor = AppColors.accentBlue;
        textColor = Colors.white;
        icon = Icons.info;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: textColor),
          const SizedBox(width: 4),
          Text(
            status,
            style: AppTextStyles.bodySmall.copyWith(
              color: textColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  void _showPaymentProofDialog(String paymentProof) {
    Get.dialog(
      Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          children: [
            // Background tap to close
            GestureDetector(
              onTap: () => Get.back(),
              child: Container(
                width: double.infinity,
                height: double.infinity,
                color: Colors.black54,
              ),
            ),
            // Image container
            Center(
              child: Container(
                margin: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue,
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(16),
                          topRight: Radius.circular(16),
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Payment Proof',
                              style: AppTextStyles.h3.copyWith(
                                color: Colors.white,
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () => Get.back(),
                            icon: const Icon(
                              Icons.close,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Image
                    Container(
                      constraints: BoxConstraints(
                        maxHeight: Get.height * 0.6,
                        maxWidth: Get.width * 0.9,
                      ),
                      child: ClipRRect(
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(16),
                          bottomRight: Radius.circular(16),
                        ),
                        child: Image.network(
                          ImageUtils.buildImageUrl(paymentProof),
                          fit: BoxFit.contain,
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Container(
                              height: 200,
                              color: AppColors.backgroundLight,
                              child: Center(
                                child: CircularProgressIndicator(
                                  color: AppColors.primaryBlue,
                                  value: loadingProgress.expectedTotalBytes != null
                                      ? loadingProgress.cumulativeBytesLoaded /
                                          loadingProgress.expectedTotalBytes!
                                      : null,
                                ),
                              ),
                            );
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              height: 200,
                              color: AppColors.backgroundLight,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.broken_image_outlined,
                                    size: 48,
                                    color: AppColors.textHint,
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    'Failed to load payment proof',
                                    style: AppTextStyles.bodyMedium.copyWith(
                                      color: AppColors.textHint,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
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
}
