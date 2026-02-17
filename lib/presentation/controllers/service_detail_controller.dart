import 'package:get/get.dart';
import '../../domain/models/medical_service_model.dart';
import '../../domain/models/medical_professional_model.dart';
import '../../data/repositories/doctor_repository_impl.dart';
import '../../data/models/branch_setting_model.dart';
import '../../config/app_routes.dart';

class ServiceDetailController extends GetxController {
  final DoctorRepository _doctorRepository;

  ServiceDetailController(this._doctorRepository);

  // Service passed from previous screen
  late MedicalService service;

  // Doctors data
  final doctors = <MedicalProfessional>[].obs;
  final isLoadingDoctors = false.obs;
  final errorMessage = Rxn<String>();

  // Branches state
  final branches = <BranchSettingModel>[].obs;
  final isLoadingBranches = false.obs;

  @override
  void onInit() {
    super.onInit();
    // Get service from arguments
    service = Get.arguments as MedicalService;
    
    // Debug: Check what we received
    print('ServiceDetailController - Service: ${service.name}');
    print('ServiceDetailController - Branches count: ${service.branches.length}');
    print('ServiceDetailController - Doctors count: ${service.medicalProfessionals.length}');
    
    loadDoctors();
    loadBranches();
  }

  void loadBranches() {
    try {
      // Use service-specific branches if available
      final serviceBranches = service.branches;
      print('ServiceDetailController - loadBranches: ${serviceBranches.length} branches');
      if (serviceBranches.isNotEmpty) {
        branches.assignAll(serviceBranches);
      }
    } catch (e) {
      print('ServiceDetailController - loadBranches error: $e');
    }
  }

  Future<void> loadDoctors() async {
    try {
      isLoadingDoctors.value = true;
      errorMessage.value = null;

      final serviceDoctors = service.medicalProfessionals;
      doctors.value = serviceDoctors
          .where((doctor) => doctor.isActive)
          .toList();
    } catch (e) {
      errorMessage.value = 'Failed to load doctors: ${e.toString()}';
    } finally {
      isLoadingDoctors.value = false;
    }
  }

  void retryLoadingDoctors() {
    loadDoctors();
  }

  void onDoctorSelected(MedicalProfessional doctor) {
    // Navigate to appointment booking with service
    Get.toNamed(Routes.bookAppointment, arguments: service);
  }

  void onBranchSelected(BranchSettingModel branch) {
    // Navigate to booking with service
    Get.toNamed(Routes.bookAppointment, arguments: service);
  }

  void onBookAppointment() {
    // Navigate to appointment booking with service
    Get.toNamed(Routes.bookAppointment, arguments: service);
  }
}
