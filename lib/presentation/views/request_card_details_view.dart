import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:flutter/services.dart'; // For TextInputFormatter
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../controllers/card_controller.dart';

class RequestCardDetailsView extends GetView<CardController> {
  RequestCardDetailsView({super.key});

  final _formKey = GlobalKey<FormState>();

  // List of all countries
  static const List<String> countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Validation functions
  String? _validateRequired(String? value) {
    if (value == null || value.isEmpty) return 'This field is required';
    return null;
  }

  String? _validateName(String? value) {
    if (value == null || value.isEmpty) return 'This field is required';
    if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) return 'Only letters and spaces allowed';
    if (value.length < 2) return 'At least 2 characters';
    return null;
  }

  String? _validateOptionalName(String? value) {
    if (value != null && value.isNotEmpty) {
      if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) return 'Only letters and spaces allowed';
      if (value.length < 2) return 'At least 2 characters';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) return 'Enter a valid email';
    return null;
  }

  String? _validatePhone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    if (!RegExp(r'^\d{10}$').hasMatch(value)) return 'Enter a 10 digit phone number';
    return null;
  }

  String? _validateAge(String? value) {
    if (value == null || value.isEmpty) return 'Age is required';
    int? age = int.tryParse(value);
    if (age == null) return 'Enter a valid number';
    if (age < 1 || age > 100) return 'Age must be between 1 and 100';
    return null;
  }


  @override
  Widget build(BuildContext context) {
    // Set status bar text color to black
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark, // For Android (dark icons)
        statusBarBrightness: Brightness.light,     // For iOS (dark text)
      ),
    );
    
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(
        statusBarColor: Colors.transparent,
      ),
      child: Scaffold(
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
                child: Form(
                  key: _formKey,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionTitle('Personal Details'),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'First Name', hint: 'Enter first name', icon: Icons.person, controller: controller.fNameController, validator: _validateName, inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z\s]'))]),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Middle Name', hint: 'Enter middle name', icon: Icons.person_outline, controller: controller.mNameController, validator: _validateOptionalName, inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z\s]'))]),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Last Name', hint: 'Enter last name', icon: Icons.person, controller: controller.lNameController, validator: _validateName, inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z\s]'))]),
                        const SizedBox(height: 16),
                        _buildTextField(
                          label: 'Age',
                          hint: 'Enter age',
                          icon: Icons.calendar_today,
                          controller: controller.dobController,
                          keyboardType: TextInputType.number,
                          validator: _validateAge,
                        ),
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
                          child: DropdownButtonFormField<String>(
                            value: controller.genderController.text.isEmpty ? null : controller.genderController.text,
                            items: const [
                              DropdownMenuItem(value: 'Male', child: Text('Male')),
                              DropdownMenuItem(value: 'Female', child: Text('Female')),
                            ],
                            onChanged: (value) {
                              controller.genderController.text = value ?? '';
                            },
                            validator: (value) => value == null || value.isEmpty ? 'Gender is required' : null,
                            decoration: InputDecoration(
                              labelText: 'Gender',
                              hintText: 'Select gender',
                              prefixIcon: const Icon(Icons.wc, color: AppColors.primaryBlue),
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
                        ),

                        const SizedBox(height: 32),
                        _buildSectionTitle('Contact Information'),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Email', hint: 'email@example.com', icon: Icons.email, controller: controller.emailController, keyboardType: TextInputType.emailAddress, validator: _validateEmail),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Phone Number', hint: '+251...', icon: Icons.phone, controller: controller.phoneController, keyboardType: TextInputType.phone, validator: _validatePhone),

                        const SizedBox(height: 32),
                        _buildSectionTitle('Address'),
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
                          child: DropdownButtonFormField<String>(
                            value: controller.countryController.text.isEmpty ? 'Ethiopia' : controller.countryController.text,
                            items: countries.map((country) => DropdownMenuItem(value: country, child: Text(country))).toList(),
                            onChanged: (value) {
                              controller.countryController.text = value ?? '';
                            },
                            validator: (value) => value == null || value.isEmpty ? 'Country is required' : null,
                            decoration: InputDecoration(
                              labelText: 'Country',
                              hintText: 'Select country',
                              prefixIcon: const Icon(Icons.public, color: AppColors.primaryBlue),
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
                        ),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'City', hint: 'Enter city', icon: Icons.location_city, controller: controller.cityController, validator: _validateRequired),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'SubCity', hint: 'Enter sub-city', icon: Icons.map, controller: controller.subCityController, validator: _validateRequired),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Address/House No.', hint: 'specific address', icon: Icons.home, controller: controller.addressController, validator: _validateRequired),

                        const SizedBox(height: 32),
                        _buildSectionTitle('Emergency Contact'),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Contact Name', hint: 'Emergency contact name', icon: Icons.person_add, controller: controller.emergencyNameController, validator: _validateName, inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z\s]'))]),
                        const SizedBox(height: 16),
                        _buildTextField(label: 'Contact Phone', hint: 'Emergency contact phone', icon: Icons.phone_callback, controller: controller.emergencyPhoneController, keyboardType: TextInputType.phone, validator: _validatePhone),

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
                          child: TextFormField(
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
                            onPressed: () {
                              if (_formKey.currentState!.validate()) {
                                controller.validateAndProceed();
                              }
                            }, // Validated navigation
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
              ),
            ],
          ),
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
    String? Function(String?)? validator,
    List<TextInputFormatter>? inputFormatters,
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
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        validator: validator,
        inputFormatters: inputFormatters,
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
    ); // Scaffold
  } // build
}
