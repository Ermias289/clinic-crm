import 'package:get/get.dart';
import '../../domain/models/medical_service_model.dart';
import '../../domain/models/medical_professional_model.dart';
import '../../data/repositories/doctor_repository_impl.dart';
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

  @override
  void onInit() {
    super.onInit();
    // Get service from arguments
    service = Get.arguments as MedicalService;
    loadDoctors();
  }

  Future<void> loadDoctors() async {
    try {
      isLoadingDoctors.value = true;
      errorMessage.value = null;

      final allDoctors = await _doctorRepository.getDoctors();

      // Filter active doctors only
      doctors.value = allDoctors.where((doctor) => doctor.isActive).toList();
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
    // Navigate to appointment booking with service only
    // The doctor selection will be handled in the appointment booking flow
    Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
  }

  void onBookAppointment() {
    // Navigate to appointment booking with service only
    // User can select doctor in the booking flow
    Get.toNamed(Routes.BOOK_APPOINTMENT, arguments: service);
  }
}
