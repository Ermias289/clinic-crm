using Clinic_CRM.DTOs.PatientDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.PatientServices
{
    public interface IPatientService
    {
        Task<Patient> AddPatient(AddPatientDTO dto);
        Task<Patient> UpdatePatient(UpdatePatientDTO dto);
        Task<Patient> DeletePatient(int Id);
        Task<Patient> GetPatientById(int Id);
        Task<List<Patient>> GetAllPatients();
        //string GenerateTemporaryPassword(int length = 10);
        Task<Patient> GetPatientByUserId(int UserId);
    }
}
