import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/card_controller.dart';

class RequestCardDetailsView extends GetView<CardController> {
  const RequestCardDetailsView({super.key});

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
                        'Request Details',
                        style: AppTextStyles.h2.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Step 1: Patient Information',
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: Colors.white.withOpacity(0.9),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Form Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionTitle('Personal Details'),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'First Name', hint: 'Enter first name', icon: Icons.person, controller: controller.fNameController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Middle Name', hint: 'Enter middle name', icon: Icons.person_outline, controller: controller.mNameController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Last Name', hint: 'Enter last name', icon: Icons.person, controller: controller.lNameController),
                    const SizedBox(height: 16),
                    _buildTextField(
                      label: 'Date of Birth', 
                      hint: 'YYYY-MM-DD', 
                      icon: Icons.calendar_today, 
                      controller: controller.dobController,
                      keyboardType: TextInputType.datetime,
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Gender', hint: 'M / F', icon: Icons.wc, controller: controller.genderController),

                    const SizedBox(height: 32),
                    _buildSectionTitle('Contact Information'),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Email', hint: 'email@example.com', icon: Icons.email, controller: controller.emailController, keyboardType: TextInputType.emailAddress),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Phone Number', hint: '+251...', icon: Icons.phone, controller: controller.phoneController, keyboardType: TextInputType.phone),

                    const SizedBox(height: 32),
                    _buildSectionTitle('Address'),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Country', hint: 'Enter country', icon: Icons.public, controller: controller.countryController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'City', hint: 'Enter city', icon: Icons.location_city, controller: controller.cityController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'SubCity', hint: 'Enter sub-city', icon: Icons.map, controller: controller.subCityController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Address/House No.', hint: 'specific address', icon: Icons.home, controller: controller.addressController),

                    const SizedBox(height: 32),
                    _buildSectionTitle('Emergency Contact'),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Contact Name', hint: 'Emergency contact name', icon: Icons.person_add, controller: controller.emergencyNameController),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Contact Phone', hint: 'Emergency contact phone', icon: Icons.phone_callback, controller: controller.emergencyPhoneController, keyboardType: TextInputType.phone),

                    const SizedBox(height: 32),
                    _buildSectionTitle('Medical Information'),
                    const SizedBox(height: 16),
                    _buildTextField(label: 'Allergies', hint: 'List any allergies', icon: Icons.warning_amber, controller: controller.allergiesController),
                    const SizedBox(height: 16),
                    Container(
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
                      padding: const EdgeInsets.all(4),
                      child: TextField(
                        controller: controller.chronicConditionsController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Chronic Conditions',
                          hintText: 'List any chronic conditions',
                          prefixIcon: const Icon(Icons.medical_services, color: AppColors.primaryBlue),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                          contentPadding: const EdgeInsets.all(16),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () => Get.toNamed('/request-card-payment'), // Navigation path
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                        ),
                        child: Text(
                          'Next Step',
                          style: AppTextStyles.h3.copyWith(color: Colors.white),
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
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTextStyles.h3.copyWith(color: AppColors.textPrimary),
    );
  }

  Widget _buildTextField({
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    required TextEditingController controller,
  }) {
    return Container(
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
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(icon, color: AppColors.primaryBlue),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: AppColors.primaryBlue, width: 1),
          ),
        ),
      ),
    );
  }
}
