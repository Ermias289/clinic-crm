using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.DTOs.BankDTOs;
using Clinic_CRM.Models.Settings;
using Clinic_CRM.Services.UserServices;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.BankServices
{
    public class BankService : IBankService
    {
        private readonly Context _context;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        //private readonly ILogService _logService;


        public BankService(Context context, IMapper mapper, IUserService userService)
        {
            _context = context;
            _mapper = mapper;
            _userService = userService;
            //_logService = logService;
        }

        public async Task<Bank> AddBank(AddBankDTO addBankDto)
        {
            var bank = _mapper.Map<Bank>(addBankDto);

            _context.Banks.Add(bank);
            await _context.SaveChangesAsync();
            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.Bank,
            //    message = "New Bank Successfully Added",
            //    UserId = _userService.GetMyId()

            //};

            //await _log.AddLogAsync(dlo);

            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANK,
            //    Action = "CreatedBank",
            //    TransactionId = bank.Id
            //});
            return bank;
        }

        public async Task<List<Bank>> GetAllBanks()
        {
            var banks = await _context.Banks
                .Include(b => b.BankAccounts)
                .ToListAsync();

            if (banks == null) throw new KeyNotFoundException("Banks Not Found");
           
            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.Bank,
            //    message = "Bank viewed",
            //    UserId = _userService.GetMyId()

            //};

            //await _log.AddLogAsync(dlo);
            return banks;
        }

        public async Task<Bank> GetBankById(int id)
        {
            var bank = await _context.Banks
                .Where(b => b.Id == id)
                .Include(b => b.BankAccounts)
                .FirstOrDefaultAsync();

            if (bank == null) throw new KeyNotFoundException("Bank Not Found");
           
            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.Bank,
            //    message = "Bank viewed",
            //    UserId = _userService.GetMyId()

            //};

            //await _log.AddLogAsync(dlo);

            return bank;
        }

        public async Task<Bank> UpdateBank(UpdateBankDTO updateBankDto)
        {
            var bank = await _context.Banks
                .Where(b => b.Id == updateBankDto.Id)
                .FirstOrDefaultAsync();

            if (bank == null) throw new KeyNotFoundException("Bank Not Found");

            _mapper.Map(updateBankDto, bank);
            _context.Banks.Update(bank);
            await _context.SaveChangesAsync();

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.Bank,
            //    message = "Bank updated",
            //    UserId = _userService.GetMyId()

            //};

            //await _log.AddLogAsync(dlo);

            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANK,
            //    Action = "UpdatedBank",
            //    TransactionId = bank.Id
            //});

            return bank;
        }

        public async Task<bool> DeleteBankById(int id)
        {
            var bank = await _context.Banks
                .Where(b => b.Id == id)
                .FirstOrDefaultAsync();

            if (bank.BankAccounts != null)
            {
                throw new InvalidOperationException("Cannot delete bank with associated bank accounts.");
            }

            if (bank == null) throw new KeyNotFoundException("Bank Not Found");

            _context.Banks.Remove(bank);
            await _context.SaveChangesAsync();

            //var dlo = new LogCreateDto
            //{
            //    logtype = LogTypes.Bank,
            //    message = "Bank Deleted",
            //    UserId = _userService.GetMyId()

            //};

            ////await _log.AddLogAsync(dlo);
            //var kal = _userService.GetCurrentUserNoInclude();
            //await _logService.AddLog(new CRM.DTOs.LogDTOs.LogCreateDTO
            //{
            //    ActionById = kal.Id, //system
            //    Category = CONSTANTS.Category_Constants.BANK,
            //    Action = "DeletedBank",
            //    TransactionId = bank.Id
            //});


            return true;
        }
    }
}
