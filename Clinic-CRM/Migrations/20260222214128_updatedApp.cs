using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class updatedApp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OneDayReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "OneHourReminderSent",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OneDayReminderSent",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "OneHourReminderSent",
                table: "Appointments");
        }
    }
}
