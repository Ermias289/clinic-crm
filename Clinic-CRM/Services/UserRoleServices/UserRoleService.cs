using AutoMapper;
using Clinic_CRM.ApplicationDbContext;
using Clinic_CRM.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.Services.UserRoleServices
{
    public class UserRoleService : IUserRoleService
    {

        private readonly Context _context;
        private readonly IMapper _mapper;
        public UserRoleService(Context context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<UserRole?> CreateRoleAsync(UserRole role)
        {
            bool roleExists = await _context.UserRoles
                .AnyAsync(r => r.Name.ToLower() == role.Name.ToLower());

            if (roleExists)
                throw new InvalidOperationException("Role With Same Name Exists.");

            UserRole newRole = _mapper.Map<UserRole>(role);

            await _context.UserRoles.AddAsync(newRole);
            await _context.SaveChangesAsync();

            return newRole;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _context.UserRoles
                .FirstOrDefaultAsync(x => x.Id == id)
                ??
                throw new KeyNotFoundException("Role Not Found.");

            _context.UserRoles.Remove(role);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<List<UserRole>?> GetAllRolesAsync()
        {
            var roles = await _context.UserRoles
                .ToListAsync();

            return roles;

        }

        public async Task<UserRole?> GetRoleByIdAsync(int id)
        {
            var role = await _context.UserRoles
                .FirstOrDefaultAsync(x => x.Id == id)
                ??
                throw new KeyNotFoundException("Role Not Found.");

            return role;

        }

        public async Task<UserRole?> UpdateRoleAsync(UserRole role)
        {

            var existingRole = await _context.UserRoles
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == role.Id)
                ??
                throw new KeyNotFoundException("Role Not Found.");

            _context.UserRoles.Update(role);

            await _context.SaveChangesAsync();

            return role;
        }

        public async Task<UserRole> GetUserRoleByRoleName(string userRoleName)
        {
            var role = await _context.UserRoles
                .Where(x => x.Name.ToLower() == userRoleName.ToLower())
                .FirstOrDefaultAsync();

            if (role == null)
                throw new KeyNotFoundException("User Role Not Found");

            return role;
        }
    }
}
