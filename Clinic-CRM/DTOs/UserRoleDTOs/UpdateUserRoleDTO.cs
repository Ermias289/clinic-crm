namespace Clinic_CRM.DTOs.UserRoleDTOs
{
    public class UpdateUserRoleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }


        public bool CanEditCompanySettings { get; set; }
        public bool CanViewCompanySettings { get; set; }
    }
}
