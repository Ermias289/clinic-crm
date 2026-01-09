using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.BankAccountDTOs;
using Clinic_CRM.Models.Settings;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.BankAccountServices
{
    public class BankAccountService : IBankAccountService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        //private readonly ILogService _log;
        private readonly IUserService _userService;
        //private readonly ILogService _logService;

        public BankAccountService(Context context, IMapper mapper, IUserService userService)
        {
            _context = context;
            _mapper = mapper;
            _userService = userService;
            //_logService = logService;
        }

        public async Task<BankAccount> AddBankAccount(AddBankAccountDTO addBankAccountDto)
        {
            var bankAccount = _mapper.Map<BankAccount>(addBankAccountDto);

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.BankAccount,
            //    message = "New Bank Account Added",
            //    UserId = _userService.GetMyId()
            //};

            //await _log.AddLogAsync(dlo);

            _context.BankAccounts.Add(bankAccount);
            await _context.SaveChangesAsync();

            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANKAccount,
            //    Action = "CreatedBankAccount",
            //    TransactionId = bankAccount.Id
            //});
            return bankAccount;
        }

        public async Task<BankAccount> UpdateBankAccount(UpdateBankAccountDTO updateBankAccountDto)
        {
            var bankAccount = await _context.BankAccounts
                .Where(b => b.Id == updateBankAccountDto.Id)
                .FirstOrDefaultAsync();

            if (bankAccount == null) throw new KeyNotFoundException("Bank account not found.");

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.BankAccount,
            //    message = "Bank Account Updated",
            //    UserId = _userService.GetMyId()


            //};

            //await _log.AddLogAsync(dlo);

            _mapper.Map(updateBankAccountDto, bankAccount);
            _context.BankAccounts.Update(bankAccount);
            await _context.SaveChangesAsync();

            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANKAccount,
            //    Action = "UpdatedBankAccount",
            //    TransactionId = bankAccount.Id
            //});
            return bankAccount;
        }

        public async Task<List<BankAccount>> GetAllBankAccountsByBankId(int? Id)
        {
            return await _context.BankAccounts.Where(x => Id == null || x.BankId == Id).ToListAsync();
        }

        public async Task<BankAccount> GetBankAccountById(int id)
        {
            var bankAccount = await _context.BankAccounts
                .Where(b => b.Id == id)
                .Include(b => b.Bank)
                .FirstOrDefaultAsync();

            if (bankAccount == null) throw new KeyNotFoundException("Bank account not found.");

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.BankAccount,
            //    message = "Bank Account Viewed",
            //    UserId = _userService.GetMyId()


            //};

            //await _log.AddLogAsync(dlo);
            return bankAccount;
        }
        public async Task<bool> DeleteBankAccount(int id)
        {
            var bankAccount = await _context.BankAccounts
                .Where(b => b.Id == id)
                .FirstOrDefaultAsync();

            if (bankAccount == null) throw new KeyNotFoundException("Bank Account Not Fount");

            _context.BankAccounts.Remove(bankAccount);
            await _context.SaveChangesAsync();

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.BankAccount,
            //    message = "Bank Account successfully deleted",
            //    UserId = _userService.GetMyId()


            //};

            //await _log.AddLogAsync(dlo);

            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANKAccount,
            //    Action = "DeletedBankAccount",
            //    TransactionId = bankAccount.Id
            //});
            return true;
        }

        //public async Task<decimal> GetCurrentBalance(int Id)
        //{
        //    var bankAccount = await _context.BankAccounts.FindAsync(Id);

        //    if (bankAccount == null) throw new KeyNotFoundException("Bank Account Not Fount");

        //    //var dlo = new LogCreateDto
        //    //{
        //    //    logtype = LogTypes.BankAccount,
        //    //    message = "Bank Account Balance Viewed",
        //    //    UserId = _userService.GetMyId()


        //    //};

        //    //await _log.AddLogAsync(dlo);
        //    return bankAccount.CurrentBalance;
        //}

        //public async Task<AccountStatusUpdateDto> UpdateAccountStatus(AccountStatusUpdateDto accounts)
        //{
        //    foreach (var id in accounts.Id)
        //    {
        //        var bankAccount = await _context.BankAccounts
        //            .Where(b => b.Id == id)
        //            .FirstOrDefaultAsync();

        //        if (bankAccount == null) continue;

        //        bankAccount.IsActive = accounts.IsActive;
        //        bankAccount.Description = accounts.Description;
        //        bankAccount.UpdatedAt = accounts.UpdatedAt;

        //        _context.BankAccounts.Update(bankAccount);
        //    }

        //    if (accounts == null) throw new InvalidOperationException("There must be at least one account.");

        //    //var dlo = new LogCreateDto
        //    //{
        //    //    logtype = LogTypes.BankAccount,
        //    //    message = "Bank Account Viewed",
        //    //    UserId = _userService.GetMyId()


        //    //};

        //    //await _log.AddLogAsync(dlo);

        //    await _context.SaveChangesAsync();

        //    var kal = _userService.GetCurrentUserNoInclude();
        //    await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
        //    {
        //        ActionById = kal.Id, //system
        //        Category = CONSTANTS.Category_Constants.BANKAccount,
        //        Action = "UpdatedAccountStatus",
        //        TransactionId = accounts.Id.FirstOrDefault()
        //    });

        //    return accounts;
        //}

    }
}
