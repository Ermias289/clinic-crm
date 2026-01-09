using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class modelFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryServiceId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_DentistryServiceId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "DentistryServiceId",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DentistryId",
                table: "Appointments",
                column: "DentistryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryId",
                table: "Appointments",
                column: "DentistryId",
                principalTable: "MedicalServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_DentistryId",
                table: "Appointments");

            migrationBuilder.AddColumn<int>(
                name: "DentistryServiceId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId",
                principalTable: "MedicalServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
