using AutoMapper;
using Clinic_CRM.DTOs.CompanySettingDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Company Setting Mappings 
            CreateMap<CompanySetting, UpdateCompanySettingDto>();
            CreateMap<UpdateCompanySettingDto, CompanySetting>();
        }
    }
}
