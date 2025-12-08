using Clinic_CRM.Models;

namespace Clinic_CRM.Services.UserRoleServices
{
    public interface IUserRoleService
    {
        Task<List<UserRole?>> GetAllRolesAsync();
        Task<UserRole?> GetRoleByIdAsync(int id);
        Task<UserRole?> CreateRoleAsync(UserRole role);
        Task<UserRole?> UpdateRoleAsync(UserRole role);
        Task<bool> DeleteRoleAsync(int id);
        Task<UserRole> GetUserRoleByRoleName(string userRoleName);
    }
}
