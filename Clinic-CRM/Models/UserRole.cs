using System.ComponentModel.DataAnnotations;

namespace Clinic_CRM.Models
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        //Company Related Permissions
        public bool CanEditCompanySettings { get; set; } = false;
        public bool CanViewCompanySettings { get; set; } = false;
        
        //User Related Permission
        public bool CanAddUser { get; set; } = false;
        public bool CanViewUser { get; set; } = false;
        public bool CanEditUser { get; set; } = false;

        //User role Permission
        public bool CanAddRole { get; set; } = false;
        public bool CanViewRole { get; set; } = false;
        public bool CanEditRole { get; set; } = false;

        //User OnBoarding Setting Permissions
        public bool CanAddUserOnBoarding { get; set; } = false;
        public bool CanEditUserOnBoarding { get; set; } = false;
        public bool CanViewUserOnBoardingSetting { get; set; } = false;
    
        //Card Setting
        public bool CanAddCardSetting { get; set; } = false;
        public bool CanViewCardSetting { get; set; } = false;
        public bool CanEditCardSetting { get; set; } = false;
        
        //Card Type
        public bool CanAddCardType { get; set; } = false;
        public bool CanEditCardType { get; set; } = false;
        public bool CanViewCardType { get; set; } = false;

        //Branch
        public bool CanAddBranchSetting { get; set; } = false;
        public bool CanViewBranchSetting { get; set; } = false;
        public bool CanEditBranchSetting { get; set; } = false;

        //Patients
        public bool CanAddPatient { get; set; } = false;    
        public bool CanEditPatient { get; set; } = false;   
        public bool CanViewPatient { get; set; } = false;


        //Doctor Schedule
        public bool CanAddDoctorSchedule { get; set; } = false;
        public bool CanEditDoctorSchedule { get; set; } = false;
        public bool CanViewDoctorSchedule { get; set; } = false;


        //Working Day Setting
        public bool CanAddWorkingSetting { get; set; } = false;
        public bool CanEditWorkingSetting { get; set; } = false;


        //Card
        public bool CanRequestCard { get; set; } = false;
        public bool CanViewCard { get; set; } = false;
        public bool CanEditCard { get; set; } = false;


        //Payment
        public bool CanApproveCardPayment { get; set; } = false;
        public bool CanCheckCardPayment { get; set; } = false;
        public bool CanRejectCardPayment { get; set; } = false;
        public bool CanViewCardPayment { get; set; } = false;
        public bool CanDeleteCardPayment { get; set; } = false;
        public bool CanCancelCardPayment { get; set; } = false;
        public bool CanEditCardPayment { get; set; } = false;
        public bool CanRequestCardPayment { get;set; } = false;


        //Appointment
        public bool CanMakeAppointment { get; set; } = false;
        public bool CanCancelAppointment { get; set; } = false;
        public bool CanCompleteAppointment { get; set; } = false;
        public bool CanViewAppointment { get; set; } = false;
        public bool CanEditAppointment { get; set; } = false;

        //Medical Professional
        public bool CanAddMedicalProfessional { get; set; } = false;
        public bool CanEditMedicalProfessional { get; set; } = false;
        public bool CanViewMedicalProfessional { get; set; } = false;


        //Medical Services
        public bool CanAddMedicalService { get; set; } = false;
        public bool CanUpdateMedicalService { get; set; } = false;
        public bool CanViewMedicalService { get; set; } = false;



        //Bank
        public bool CanAddBank { get; set; } = false;
        public bool CanEditBank { get; set; } = false;
        public bool CanViewBank { get; set; } = false;  

        //Bank Account
        public bool CanAddBankAccount { get; set; } = false;
        public bool CanEditBankAccount { get; set; } = false;
        public bool CanViewBankAccount { get; set; } = false;

        //Notification
        public bool CanReadNotification { get; set; } = false;
        public bool CanViewNotification { get; set; } = false;


        //Payment Type
        public bool CanAddPaymentType { get; set; } = false;
        public bool CanEditPaymentType { get; set; } = false;
        public bool CanViewPaymentType { get; set; } = false;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
