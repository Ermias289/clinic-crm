using Clinic_CRM.DTOs.BankAccountDTOs;
using Clinic_CRM.Models.Settings;


namespace Clinic_CRM.Services.BankAccountServices
{
    public interface IBankAccountService
    {
        Task<BankAccount> AddBankAccount(AddBankAccountDTO addBankAccountDto);
        Task<BankAccount> UpdateBankAccount(UpdateBankAccountDTO updateBankAccountDto);
        Task<BankAccount> GetBankAccountById(int id);
        Task<List<BankAccount>> GetAllBankAccountsByBankId(int? Id);
        Task<bool> DeleteBankAccount(int id);
        //Task<decimal> GetCurrentBalance(int id);
        //Task<AccountStatusUpdateDto> UpdateAccountStatus(AccountStatusUpdateDto accounts);
    }
}
