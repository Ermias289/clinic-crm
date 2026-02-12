namespace Clinic_CRM.DTOs.DashboardDTOs
{
    public class ServiceUsageDTO
    {
        public int Id { get; set; }
        public string ServiceName { get; set; }
        public int BookingCount { get; set; }
    }

    public class MostBookedServicesDTO
    {
        public List<ServiceUsageDTO> TopServices { get; set; } = new();
    }

}
