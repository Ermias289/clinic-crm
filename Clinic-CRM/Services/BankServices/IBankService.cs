using Clinic_CRM.DTOs.BankDTOs;
using Clinic_CRM.Models.Settings;

namespace Clinic_CRM.Services.BankServices
{
    public interface IBankService
    {
        Task<Bank> AddBank(AddBankDTO addBankDto);
        Task<List<Bank>> GetAllBanks();
        Task<Bank> GetBankById(int id);
        Task<Bank> UpdateBank(UpdateBankDTO updateBankDto);
        Task<bool> DeleteBankById(int id);
    }
}
