namespace Clinic_CRM.Helpers
{
    public class Constants
    {
        public class USER_ROLES
        {
            public const string SUPER_ADMIN = "Super Admin";
            public const string ADMIN = "Admin";
            public const string RECEPTIONIST = "Receptionist";
            public const string PATIENT = "Patient";
        }

        public class MEDICAL_PROFESSIONS_STATUS
        {
            public const string ACTIVE = "Active";
            public const string INACTIVE = "InActive";
        }

        public static class DAYS_OF_WEEK
        {
            public const string MONDAY = "Monday";
            public const string TUESDAY = "Tuesday";
            public const string WEDNESDAY = "Wednesday";
            public const string THURSDAY = "Thursday";
            public const string FRIDAY = "Friday";
            public const string SATURDAY = "Saturday";
            public const string SUNDAY = "Sunday";
        }

        public static class CARD_STATUS
        {
            public const string ACTIVE = "Active";
            public const string EXPIRED = "Expired";
            public const string INACTIVE = "InActive";
            public const string PENDING = "Pending";
        }

        public static class PREFIX
        {
            public const string CARD = "CARD";
            public const string CARD_PAYMENT = "CP";
            public const string APPOINTMENT = "APP";
            public const int PADDING = 6;
        }

        public static class PAYMENT_STATUS
        {
            public const string REQUESTED = "Requested";
            public const string APPROVED = "Approved";
            public const string REJECTED = "Rejected";
            public const string CHECKED = "Checked";
            public const string CANCELED = "Canceled";
            public const string PARTIALLYPAID = "Partially-Paid";
            public const string AUTOPREPARED = "Auto-Prepared";
        }

        public static class APPOINTMENT_STATUS
        {
            public const string SCHEDULED = "Scheduled";
            public const string RESCHEDULED = "ReScheduled";
            public const string CANCELED = "Canceled";
            public const string COMPLETED = "Completed";
            public const string OVERDUE = "Overdue";    
        }

        public static class NOTIFICATION_CONSTANTS
        {
            public const string USER = "User";
            public const string SYSTEM = "System";
            public const string NEWUSER = "New User";
            public const string CARD = "Card";
            public const string APPOINTMENT = "Appointment";
            public const string PAYMENT = "Payment";
            public const string DOCTORSCHEDULE = "Doctor Schedule";
            public const string SERVICE = "Service";
        }
    }
}
