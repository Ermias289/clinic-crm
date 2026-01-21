import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:intl/intl.dart';
import '../../domain/models/medical_service_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../config/app_routes.dart';
import '../../core/api_client.dart';
import '../../data/models/card_model.dart';
import '../controllers/appointment_controller.dart';
import '../../core/services/appointment_event_service.dart';

class AppointmentBookingView extends StatefulWidget {
  const AppointmentBookingView({super.key});

  @override
  State<AppointmentBookingView> createState() => _AppointmentBookingViewState();
}

class _AppointmentBookingViewState extends State<AppointmentBookingView> {
  final _formKey = GlobalKey<FormState>();
  late MedicalService service;
  CardModel? userCard;
  bool isLoadingCard = true;

  // Selected values must come from the doctor schedule picker (not free pickers)
  String? selectedDoctorName;
  int? selectedDoctorId;
  DateTime? selectedDate;
  TimeOfDay? selectedTime;
  DateTime? selectedDateTime;

  @override
  void initState() {
    super.initState();
    service = Get.arguments as MedicalService;
    _loadUserCard();
  }

  bool _hasLoadedOnce = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Auto-refresh when returning to this page
    if (_hasLoadedOnce) {
      _loadUserCard();
    } else {
      _hasLoadedOnce = true;
    }
  }

  Future<void> _loadUserCard() async {
    try {
      setState(() {
        isLoadingCard = true;
      });

      final apiClient = Get.find<ApiClient>();

      // Get current user ID
      final box = GetStorage();
      final userId = box.read('userId');

      if (userId == null) {
        setState(() {
          userCard = null;
          isLoadingCard = false;
        });
        return;
      }

      // Call the new backend endpoint: /api/Card/cardByUserId/{UserId}
      // Note: ApiClient base URL usually includes /api, so we might just need /Card/cardByUserId/$userId
      // but let's check if ApiClient handles the prefix. Usually it does.
      final endpoint = '/Card/cardByUserId/$userId';

      final response = await apiClient.get(endpoint);

      if (!response.hasError && response.body != null) {
        setState(() {
          userCard = CardModel.fromJson(response.body as Map<String, dynamic>);
        });
      } else {
        ;
        setState(() {
          userCard = null;
        });
      }
    } catch (e, stackTrace) {
      // User doesn't have a card yet, or network error
      setState(() {
        userCard = null;
      });
    } finally {
      setState(() {
        isLoadingCard = false;
      });
    }
  }

  Future<void> _openDoctorSchedulePicker() async {
    final result = await Get.toNamed(
      Routes.DOCTOR_SCHEDULE_PICKER,
      arguments: service,
    );

    if (result is Map) {
      setState(() {
        selectedDoctorId = result['doctorId'] as int?;
        selectedDoctorName = result['doctorName'] as String?;
        selectedDate = result['date'] as DateTime?;
        selectedTime = result['time'] as TimeOfDay?;
        selectedDateTime = result['dateTime'] as DateTime?;
      });
    }
  }

  Future<void> _submitBooking() async {
    if (_formKey.currentState!.validate() &&
        selectedDoctorId != null &&
        selectedDate != null &&
        selectedTime != null &&
        selectedDateTime != null) {
      // Show confirmation dialog
      final confirmed = await _showConfirmationDialog();

      if (confirmed == true) {
        await _bookAppointment();
      }
    } else {
      Get.snackbar(
        'Required',
        'Please select doctor, date and time',
        backgroundColor: AppColors.warningOrange,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
    }
  }

  Future<bool?> _showConfirmationDialog() {
    return Get.dialog<bool>(
      Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.calendar_month_rounded,
                  color: AppColors.primaryBlue,
                  size: 48,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Confirm Appointment',
                style: AppTextStyles.h2.copyWith(fontSize: 22),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Please review your appointment details',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    _buildDetailRow(
                      Icons.medical_services,
                      'Service',
                      service.name,
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.person,
                      'Doctor',
                      selectedDoctorName ?? 'N/A',
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.calendar_today,
                      'Date',
                      DateFormat('EEEE, d MMM yyyy').format(selectedDate!),
                    ),
                    const Divider(height: 24),
                    _buildDetailRow(
                      Icons.access_time,
                      'Time',
                      DateFormat.jm().format(selectedDateTime!),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Get.back(result: false),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: AppColors.textHint),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Get.back(result: true),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: AppColors.primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Proceed',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      barrierDismissible: false,
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.primaryBlue),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTextStyles.caption),
              const SizedBox(height: 2),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _bookAppointment() async {
    try {
      // Show loading
      Get.dialog(
        const Center(
          child: CircularProgressIndicator(color: AppColors.fountainBlue),
        ),
        barrierDismissible: false,
      );

      final apiClient = Get.find<ApiClient>();

          // Get actual patient ID (not userId)
      final patientId = await _getPatientId();
      if (patientId == null) {
        Get.back(); // Close loading dialog
        throw Exception(
          'Patient not found. Please ensure you have a valid patient record.',
        );
      }

      // Format date and time for API
      final dateOnly = DateFormat('yyyy-MM-dd').format(selectedDate!);
      final timeOnly = DateFormat('H:mm').format(selectedDateTime!);

      final response = await apiClient.post('/Appointment', {
        'dentistryId': service.id,
        'medicalProfessionalId': selectedDoctorId,
        'patientId': patientId, // Added missing patient ID
        'day': dateOnly,
        'reservationTime': timeOnly,
      });

      // Close loading dialog
      Get.back();

      if (response.hasError) {
        // Handle specific error messages
        String errorMessage =
            response.statusText ?? 'Failed to book appointment';

        if (response.body is Map && response.body['message'] != null) {
          final backendMessage = response.body['message'] as String;

          // Only show activation message for invalid/very old expiration dates
          // If the expiration date is 0001-01-02 or similar, it means card needs activation
          if (backendMessage.contains('card will expire') &&
              (backendMessage.contains('0001-01-') ||
                  backendMessage.contains('1900-01-'))) {
            errorMessage =
                'Your card needs to be activated before booking appointments. Please contact support or wait for card approval.';
          } else {
            // For legitimate expiration dates or other errors, show the backend message
            errorMessage = backendMessage;
          }
        }

        throw Exception(errorMessage);
      }

      // Show success message
      Get.snackbar(
        'Success',
        'Appointment booked successfully!',
        backgroundColor: AppColors.successGreen,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 3),
      );

      // Notify that a new appointment was created
      try {
        AppointmentEventService.to.notifyAppointmentCreated();
      } catch (e) {}

      // Refresh appointments list before navigating back
      try {
        final appointmentController = Get.find<AppointmentController>();
        await appointmentController.refreshAppointments();
      } catch (e) {}

      // Navigate back to dashboard
      Get.until((route) => route.isFirst);
    } catch (e) {
      // Close loading dialog if still open
      if (Get.isDialogOpen ?? false) {
        Get.back();
      }

      Get.snackbar(
        'Error',
        'Failed to book appointment: ${e.toString()}',
        backgroundColor: AppColors.warningOrange,
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 4),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Column(
        children: [
          // Header Section
          Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
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
            child: SafeArea(
              child: Stack(
                children: [
                  Positioned(
                    right: -20,
                    top: -20,
                    child: CircleAvatar(
                      radius: 60,
                      backgroundColor: Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 10,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            IconButton(
                              onPressed: () => Get.back(),
                              icon: const Icon(
                                Icons.arrow_back_ios,
                                color: Colors.white,
                                size: 20,
                              ),
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                            ),
                            const SizedBox(width: 16),
                            Text(
                              'Book Appointment',
                              style: AppTextStyles.h2.copyWith(
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'Service',
                          style: AppTextStyles.caption.copyWith(
                            color: Colors.white70,
                          ),
                        ),
                        Text(
                          service.name,
                          style: AppTextStyles.h3.copyWith(color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Form Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User Card Display
                  _buildUserCardDisplay(),

                  // Form Section
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Doctor, Date & Time', style: AppTextStyles.h3),
                          const SizedBox(height: 8),
                          Text(
                            'Choose from the doctor\'s available schedule',
                            style: AppTextStyles.bodySmall,
                          ),
                          const SizedBox(height: 24),

                          _buildSelectionCard(
                            title: 'Select Doctor & Slot',
                            value:
                                (selectedDoctorName == null ||
                                    selectedDateTime == null)
                                ? 'Choose Doctor, Date & Time'
                                : '${selectedDoctorName!} • ${DateFormat('EEE, d MMM').format(selectedDateTime!)} • ${DateFormat.jm().format(selectedDateTime!)}',
                            icon: Icons.event_available_rounded,
                            onTap: _openDoctorSchedulePicker,
                            isSelected:
                                selectedDoctorId != null &&
                                selectedDateTime != null,
                          ),

                          const SizedBox(height: 40),

                          // Button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: userCard?.isActive == true
                                  ? _submitBooking
                                  : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primaryBlue,
                                foregroundColor: Colors.white,
                                elevation: 8,
                                shadowColor: AppColors.primaryBlue.withValues(
                                  alpha: 0.4,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                disabledBackgroundColor: AppColors.textSecondary
                                    .withValues(alpha: 0.3),
                              ),
                              child: Text(
                                userCard?.isActive == true
                                    ? 'Book Appointment'
                                    : 'Card Required',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                        ],
                      ),
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

  Widget _buildSelectionCard({
    required String title,
    required String value,
    required IconData icon,
    required VoidCallback onTap,
    required bool isSelected,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: AppColors.softShadow,
        border: Border.all(
          color: isSelected ? AppColors.primaryBlue : Colors.transparent,
          width: 1.5,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryBlue.withValues(alpha: 0.1)
                        : AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    icon,
                    color: isSelected
                        ? AppColors.primaryBlue
                        : AppColors.textSecondary,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: AppTextStyles.caption),
                      const SizedBox(height: 4),
                      Text(
                        value,
                        style: AppTextStyles.bodyMedium.copyWith(
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? AppColors.textPrimary
                              : AppColors.textHint,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16,
                  color: isSelected
                      ? AppColors.primaryBlue
                      : AppColors.textHint,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUserCardDisplay() {
    if (isLoadingCard) {
      return Container(
        height: 200,
        margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: const Center(
          child: CircularProgressIndicator(color: AppColors.fountainBlue),
        ),
      );
    }

    if (userCard == null) {
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(
              Icons.credit_card_off,
              size: 48,
              color: AppColors.textSecondary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No Active Card',
              style: AppTextStyles.h3.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Text(
              'You need an active card to book appointments',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => Get.toNamed(Routes.CARDS),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text('Request Card'),
            ),
          ],
        ),
      );
    }

    // Display the user's card
    final cardTypeName = userCard!.cardType?.name ?? 'CLINIC';
    final expiryDate = userCard!.calculatedExpiryDate ?? userCard!.expiredAt;
    final isActive = userCard!.isActive;

    LinearGradient cardGradient;
    if (cardTypeName.toLowerCase() == 'platinum') {
      cardGradient = const LinearGradient(
        colors: [Color(0xFF1a1a1a), Color(0xFF333333), Color(0xFF4d4d4d)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    } else if (cardTypeName.toLowerCase() == 'gold') {
      cardGradient = const LinearGradient(
        colors: [Color(0xFFFFD700), Color(0xFFFFB347), Color(0xFFFFA500)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    } else {
      cardGradient = const LinearGradient(
        colors: [Color(0xFFE8E8E8), Color(0xFFC0C0C0), Color(0xFFA8A8A8)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );
    }

    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        gradient: cardGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
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
                color: Colors.white.withValues(alpha: 0.1),
              ),
            ),
          ),
          Positioned(
            bottom: -20,
            left: -40,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.05),
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
                      '$cardTypeName SUBSCRIPTION',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                // Center: Card Number
                Text(
                  userCard!.cardNumber.isNotEmpty
                      ? userCard!.cardNumber
                      : '**** **** **** 1234',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: Colors.white,
                    letterSpacing: 2,
                  ),
                ),
                const Spacer(),
                // Bottom: Expiry and Status
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'EXP ${expiryDate != null ? DateFormat('MM/yy').format(expiryDate) : 'N/A'}',
                          style: AppTextStyles.caption.copyWith(
                            color: Colors.white,
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Status: ${isActive ? 'ACTIVE' : 'INACTIVE'}',
                          style: AppTextStyles.caption.copyWith(
                            color: isActive ? Colors.green : Colors.orange,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    if (!isActive)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'PENDING',
                          style: AppTextStyles.caption.copyWith(
                            color: Colors.orange,
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
  }
}

  Future<int?> _getPatientId() async {
    try {
      // Always get the current user's patient ID dynamically
      final box = GetStorage();
      final userIdRaw = box.read('userId');
      if (userIdRaw == null) {
        return null;
      }

      int userId;
      if (userIdRaw is int) {
        userId = userIdRaw;
      } else if (userIdRaw is String) {
        try {
          userId = int.parse(userIdRaw);
        } catch (e) {
          return null;
        }
      } else {
        return null;
      }

      final apiClient = Get.find<ApiClient>();

      try {
        // First try the direct patient endpoint
        final patientResponse = await apiClient.get(
          '/Patient/byUserId/$userId',
        );

        if (!patientResponse.hasError) {
          final patientData = patientResponse.body;
          final patientId = patientData['id'];

          if (patientId != null) {
            return patientId;
          }
        }
      } catch (e) {
        // Continue to fallback
      }

      // Fallback to card endpoint if patient endpoint fails
      final response = await apiClient.get('/Card/cardByUserId/$userId');

      if (response.hasError) {
        // If user doesn't have a card/patient record, return null
        if (response.statusCode == 404) {
          return null;
        }
        return null;
      }

      final cardData = response.body;
      final patientId = cardData['patient']?['id'];

      if (patientId != null) {
        return patientId;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

