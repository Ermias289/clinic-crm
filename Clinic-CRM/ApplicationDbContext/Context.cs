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
        public DbSet<Patient> Patients { get; set; }
        public DbSet<CardType> CardTypes { get; set; }
        public DbSet<BranchSetting> BranchSettings { get; set; }
        public DbSet<DentistryService> DentistryServices { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<MedicalProfessional> MedicalProfessionals { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<WorkingDaySetting> Workdays { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Patient>()
               .HasOne(c => c.User)
               .WithMany()
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Card>()
               .HasOne(c => c.Patient)
               .WithMany()
               .HasForeignKey(c => c.PatientId)
               .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
