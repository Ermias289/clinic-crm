namespace Clinic_CRM.Models
{
    public class UserRole
    {
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



        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
