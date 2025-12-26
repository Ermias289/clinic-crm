import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../data/models/appointment_model.dart';
import '../../domain/repositories/appointment_repository.dart';

class AppointmentController extends GetxController {
  final AppointmentRepository repository;
  final _box = GetStorage();

  AppointmentController({required this.repository});

  final RxList<AppointmentModel> appointments = <AppointmentModel>[].obs;
  final RxBool isLoading = false.obs;
  final RxString error = ''.obs;

  @override
  void onInit() {
    super.onInit();
    fetchAppointments();
  }

  Future<void> fetchAppointments() async {
    try {
      isLoading.value = true;
      error.value = '';
      
      final userId = _box.read('userId');
      if (userId == null) {
        error.value = 'User ID not found';
        return;
      }

      final result = await repository.getAppointments(userId);
      appointments.assignAll(result);
    } catch (e) {
      error.value = e.toString();
      Get.snackbar('Error', 'Failed to fetch appointments');
    } finally {
      isLoading.value = false;
    }
  }
}
