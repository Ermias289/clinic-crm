using Clinic_CRM.Models;
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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}
