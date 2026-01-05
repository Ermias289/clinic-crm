using Clinic_CRM.DTOs.AppointmentDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.AppointmentServices
{
    public interface IAppointmentService
    {
        Task<Appointment> MakeAppointment(AddAppointmentDTO dto);
        Task<Appointment> UpdateAppointment(UpdateAppointmentDTO dto);
        Task<Appointment> GetAppointmentById(int id);
        Task<List<Appointment>> GetAllAppointment();
        Task<Appointment> DeleteAppointment(int Id);
        Task<Appointment> CancelAppointment(int Id, string Reason);
        Task<bool> CompleteAppointment(List<int> Ids);
        Task<List<Appointment>> GetAppointmentsByPatientId(int Id);
        Task<List<Appointment>> GetAppointmentByUserId(int userId);
    }
}
