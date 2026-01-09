using Clinic_CRM.DTOs.UserDTOs;
using Clinic_CRM.Models;

namespace Clinic_CRM.Services.UserServices
{
    public interface IUserService
    {
        public User User { get; }
        UserRole UserRole { get; }
        string GetMyName();
        int GetMyId();
        public User GetCurrentUser();
        public User GetCurrentUserNoInclude();
        Task<GetUserDTO> CreateUserAsync(CreateUserAccountDTO dto);
        //Task<bool> ImportUserAsync(List<CreateUserAccountDTO> dto);
        Task<List<GetUserDTO>> GetAllUsersAsync();
        Task<GetUserDTO> GetUserByIdAsync(int id);
        Task<GetUserDTO> UpdateUserAsync(UpdateUserAccountDTO dto);
        Task<bool> DeleteUserAsync(int id);

        Task<string> ConfirmEmailAccount(string OTP, string email);
        // AUTH RELATED

        Task<LogInReturnDTO> CreateToken(User user);
        Task<LogInReturnDTO> Login(LogInDTO dto);
        Task<bool> SetPassword(ChangePasswordDTO dto);

        string GenerateTemporaryPassword(int length = 10);


    }
}
