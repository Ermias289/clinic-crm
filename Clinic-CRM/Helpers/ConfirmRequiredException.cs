namespace Clinic_CRM.Helpers
{
    public class ConfirmRequiredException : Exception
    {
        public ConfirmRequiredException(string message) : base(message) { }
        public ConfirmRequiredException()
        {

        }
    }
}
