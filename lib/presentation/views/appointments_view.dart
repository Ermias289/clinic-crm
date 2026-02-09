import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../config/app_routes.dart';
import '../controllers/appointment_controller.dart';
import '../controllers/profile_controller.dart';
import '../widgets/notification_badge.dart';
import '../../core/utils/error_handler.dart';

class AppointmentsView extends StatefulWidget {
  const AppointmentsView({super.key});

  @override
  State<AppointmentsView> createState() => _AppointmentsViewState();
}

class _AppointmentsViewState extends State<AppointmentsView>
    with WidgetsBindingObserver {
  AppointmentController get controller => Get.find<AppointmentController>();
  bool _hasInitialized = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    // Refresh when app comes back to foreground
    if (state == AppLifecycleState.resumed && _hasInitialized) {
      controller.refreshAppointments();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Refresh when returning to this page (e.g., after booking an appointment)
    if (_hasInitialized) {
      controller.refreshAppointments();
    } else {
      _hasInitialized = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Set status bar to be visible
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return GetBuilder<ProfileController>(
      init: Get.find<ProfileController>(),
      builder: (profileController) {
        final userName =
            profileController.currentUser.value?.fullname ??
            profileController.currentUser.value?.fName ??
            'Patient';

        return Scaffold(
          backgroundColor: AppColors.backgroundLight,
          body: SafeArea(
            child: RefreshIndicator(
              onRefresh: () => controller.refreshAppointments(),
              child: Column(
                children: [
                  Obx(() {
                    final userCard = controller.userCard.value;
                    final cardTypeName = userCard?.cardType?.name ?? 'Standard';
                    final isActive = userCard?.isActive ?? false;
                    final expiryDate =
                        userCard?.calculatedExpiryDate ?? userCard?.expiredAt;

                    LinearGradient cardGradient;
                    if (cardTypeName.toLowerCase() == 'platinum') {
                      cardGradient = const LinearGradient(
                        colors: [
                          Color(0xFF1a1a1a),
                          Color(0xFF333333),
                          Color(0xFF4d4d4d),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      );
                    } else if (cardTypeName.toLowerCase() == 'gold') {
                      cardGradient = const LinearGradient(
                        colors: [
                          Color(0xFFFFD700),
                          Color(0xFFFFB347),
                          Color(0xFFFFA500),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      );
                    } else {
                      cardGradient = const LinearGradient(
                        colors: [
                          AppColors.primaryBlue,
                          AppColors.primaryBlueLight,
                          AppColors.accentBlue,
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      );
                    }

                    return Container(
                      margin: const EdgeInsets.all(20),
                      height: 220,
                      decoration: BoxDecoration(
                        gradient: cardGradient,
                        borderRadius: BorderRadius.circular(24),
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
                          // Decorative circles
                          Positioned(
                            right: -30,
                            top: -30,
                            child: Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                          ),
                          Positioned(
                            left: -20,
                            bottom: -20,
                            child: Container(
                              width: 100,
                              height: 100,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.05),
                              ),
                            ),
                          ),

                          // Content
                          Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                // Top section
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Patient Card',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white.withOpacity(
                                                  0.9,
                                                ),
                                                letterSpacing: 1.0,
                                                fontWeight: FontWeight.w500,
                                              ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'Lucid Dental Clinic',
                                          style: AppTextStyles.h3.copyWith(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    // Notification Icon
                                    const NotificationBadge(iconSize: 32),
                                  ],
                                ),

                                // Middle section - Patient Name & Card Number
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      userName.toUpperCase(),
                                      style: AppTextStyles.h2.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 2,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    if (userCard != null) ...[
                                      const SizedBox(height: 8),
                                      Text(
                                        userCard.cardNumber,
                                        style: AppTextStyles.bodyMedium
                                            .copyWith(
                                              color: Colors.white.withOpacity(
                                                0.9,
                                              ),
                                              letterSpacing: 3,
                                              fontWeight: FontWeight.w500,
                                            ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ],
                                ),

                                // Bottom section: Expiry & Status
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        // Show Expiry Date if card exists
                                        if (userCard != null) ...[
                                          Text(
                                            'EXP ${expiryDate != null ? DateFormat('MM/yy').format(expiryDate) : 'N/A'}',
                                            style: AppTextStyles.bodyMedium
                                                .copyWith(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                          ),
                                          const SizedBox(height: 4),
                                        ],
                                        // Show Active Appointments Count
                                        Obx(
                                          () => Text(
                                            '${controller.appointments.length} Active Appts',
                                            style: AppTextStyles.bodySmall
                                                .copyWith(
                                                  color: Colors.white
                                                      .withOpacity(0.8),
                                                ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    if (userCard != null)
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          color: isActive
                                              ? Colors.white.withOpacity(0.2)
                                              : Colors.orange.withOpacity(0.8),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              isActive
                                                  ? Icons.verified_user
                                                  : userCard.status
                                                            .toLowerCase() ==
                                                        'pending'
                                                  ? Icons.hourglass_empty
                                                  : Icons.warning_amber_rounded,
                                              color: Colors.white,
                                              size: 16,
                                            ),
                                            const SizedBox(width: 4),
                                            Flexible(
                                              child: Text(
                                                userCard.status.toUpperCase(),
                                                style: AppTextStyles.bodySmall
                                                    .copyWith(
                                                      color: Colors.white,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize: 10,
                                                    ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                      )
                                    else
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.2),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                        ),
                                        child: Text(
                                          'NO CARD',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 10,
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
                    );
                  }),

                  // Content
                  Expanded(
                    child: Obx(() {
                      if (controller.isLoading.value) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (controller.appointments.isEmpty) {
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.calendar_today_outlined,
                                size: 80,
                                color: AppColors.textHint,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No appointments yet',
                                style: AppTextStyles.h3.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 40,
                                ),
                                child: Text(
                                  'Your upcoming appointments will appear here',
                                  style: AppTextStyles.bodyMedium.copyWith(
                                    color: AppColors.textHint,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ],
                          ),
                        );
                      }

                      return ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        itemCount: controller.appointments.length,
                        itemBuilder: (context, index) {
                          final appointment = controller.appointments[index];
                          return GestureDetector(
                            onTap: () async {
                              final result = await Get.toNamed(
                                Routes.appointmentDetails,
                                arguments: appointment,
                              );
                              if (result == true) {
                                ErrorHandler.showSuccess('Appointment cancelled successfully');
                                // Ensure list is refreshed
                                controller.refreshAppointments();
                              }
                            },
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 16),
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
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Flexible(
                                                    child: Builder(
                                                      builder: (context) {
                                                        final serviceName =
                                                            appointment
                                                                .dentistryService
                                                                ?.name ??
                                                            'Service';
                                                        return Text(
                                                          serviceName,
                                                          style: AppTextStyles
                                                              .bodyLarge
                                                              .copyWith(
                                                                fontWeight:
                                                                    FontWeight.bold,
                                                              ),
                                                          maxLines: 1,
                                                          overflow:
                                                              TextOverflow.ellipsis,
                                                        );
                                                      },
                                                    ),
                                                  ),
                                                  if (appointment.reference !=
                                                      null) ...[
                                                    const SizedBox(width: 8),
                                                    Container(
                                                      padding:
                                                          const EdgeInsets.symmetric(
                                                        horizontal: 8,
                                                        vertical: 2,
                                                      ),
                                                      decoration: BoxDecoration(
                                                        color: AppColors.primaryBlue
                                                            .withOpacity(0.1),
                                                        borderRadius:
                                                            BorderRadius.circular(4),
                                                      ),
                                                      child: Text(
                                                        appointment.reference!,
                                                        style: AppTextStyles
                                                            .bodySmall
                                                            .copyWith(
                                                          color:
                                                              AppColors.primaryBlue,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          fontSize: 10,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ],
                                              ),
                                              const SizedBox(height: 4),
                                              if (appointment.medicalProfessional !=
                                                  null) ...[
                                                Text(
                                                  '${appointment.medicalProfessional!.prefix} ${appointment.medicalProfessional!.fName} ${appointment.medicalProfessional!.lName}',
                                                  style: AppTextStyles.bodySmall
                                                      .copyWith(
                                                    color: AppColors.textHint,
                                                  ),
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                ),
                                              ],
                                            ],
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          color:
                                              (appointment.status ?? '')
                                                      .toLowerCase() ==
                                                  'completed'
                                              ? Colors.green.withOpacity(0.1)
                                              : AppColors.primaryBlue
                                                    .withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                        ),
                                        child: Text(
                                          appointment.status ?? 'Scheduled',
                                          style: AppTextStyles.bodySmall
                                              .copyWith(
                                                color:
                                                    (appointment.status ?? '')
                                                            .toLowerCase() ==
                                                        'completed'
                                                    ? Colors.green
                                                    : AppColors.primaryBlue,
                                                fontWeight: FontWeight.bold,
                                              ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  const Divider(),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Flexible(
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              Icons.calendar_today,
                                              size: 16,
                                              color: AppColors.textHint,
                                            ),
                                            const SizedBox(width: 8),
                                            Flexible(
                                              child: Text(
                                                appointment.day,
                                                style: AppTextStyles.bodyMedium,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Flexible(
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              Icons.access_time,
                                              size: 16,
                                              color: AppColors.textHint,
                                            ),
                                            const SizedBox(width: 8),
                                            Flexible(
                                              child: Text(
                                                appointment.reservationTime,
                                                style: AppTextStyles.bodyMedium,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      if (appointment
                                                  .dentistryService
                                                  ?.durationInMinutes !=
                                              null &&
                                          appointment
                                                  .dentistryService!
                                                  .durationInMinutes >
                                              0) ...[
                                        const SizedBox(width: 16),
                                        Flexible(
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(
                                                Icons.timer_outlined,
                                                size: 16,
                                                color: AppColors.textHint,
                                              ),
                                              const SizedBox(width: 8),
                                              Flexible(
                                                child: Text(
                                                  '${appointment.dentistryService!.durationInMinutes} min',
                                                  style:
                                                      AppTextStyles.bodyMedium,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),
          floatingActionButton: FloatingActionButton.extended(
            onPressed: () => Get.toNamed(Routes.paymentHistory),
            backgroundColor: AppColors.primaryBlue,
            icon: const Icon(Icons.payment),
            label: const Text('Payment History'),
          ),
        );
      },
    );
  }
}
