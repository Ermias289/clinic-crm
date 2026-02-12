namespace Clinic_CRM.DTOs.DashboardDTOs
{
    public class DashBoardData
    {
        public int ScheduledAppointmentsCount { get; set; } = 0;
        public int CompletedAppointmentsCount { get; set; } = 0;
        public int CanceledAppointmentsCount { get; set; } = 0;
    }

    public class DashboardDTO
    {
        public DashBoardData Monday { get; set; }
        public DashBoardData Tuesday { get; set; }
        public DashBoardData Wednesday { get; set; }
        public DashBoardData Thursday { get; set; }
        public DashBoardData Friday { get; set; }
        public DashBoardData Saturday { get; set; }
        public DashBoardData Sunday { get; set; }
    }
}
