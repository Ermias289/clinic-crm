import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/models/appointment_model.dart';
import '../../domain/repositories/appointment_repository.dart';
import '../../core/utils/error_handler.dart';
import '../controllers/appointment_controller.dart';

class AppointmentDetailController extends GetxController {
  final AppointmentRepository repository;
  final AppointmentModel appointment;
  
  final isLoading = false.obs;

  AppointmentDetailController({required this.repository}) 
      : appointment = Get.arguments as AppointmentModel;

  Future<void> cancelAppointment(String reason) async {
    if (appointment.id == null) {
      ErrorHandler.showError('Invalid appointment ID');
      return;
    }

    try {
      isLoading.value = true;
      final success = await repository.cancelAppointment(appointment.id!, reason);
      
      if (success) {
        // Refresh the appointments list
        if (Get.isRegistered<AppointmentController>()) {
          Get.find<AppointmentController>().refreshAppointments();
        }
        
        // Go back with success result
        Get.back(result: true);
      }
    } catch (e) {
      ErrorHandler.handleError(e, customTitle: 'Cancellation Failed');
    } finally {
      isLoading.value = false;
    }
  }
}
