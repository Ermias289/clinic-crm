using Clinic_CRM.DTOs.DoctorScheduleDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.DoctorScheduleServices
{
    public interface IDoctorScheduleServices
    {
        Task<DoctorSchedule> AddDoctorSchedule(AddDoctorScheduleDTO dto);
        Task<DoctorSchedule> UpdateDoctorSchedule(UpdateDoctorScheduleDTO dto);
        Task<DoctorSchedule> GetDoctorScheduleById(int Id);
        Task<List<DoctorSchedule>> GetAllDoctorSchedules();
        Task<DoctorSchedule> DeleteDoctorSchedule(int Id);
    }
}
