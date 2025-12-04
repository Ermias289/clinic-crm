using Clinic_CRM.Models;
using Clinic_CRM.Models.Settings;
using Microsoft.EntityFrameworkCore;

namespace Clinic_CRM.ApplicationDbContext
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) 
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<CompanySetting> CompanySetting { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserOnBoardingSetting> UserOnBoardingSettings { get; set; }
        public DbSet<CardSetting> CardSettings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}
