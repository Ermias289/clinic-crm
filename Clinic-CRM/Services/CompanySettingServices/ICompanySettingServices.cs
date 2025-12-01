using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.CompanySettingServices
{
    public interface ICompanySettingServices
    {
        Task<CompanySetting> UpdateCompanySetting(UpdateCompanySettingDto updateCompanySettingDto);
        Task<CompanySetting> GetCompanySetting();
        Task<CompanySetting> DeleteCompanySetting();
    }
}
