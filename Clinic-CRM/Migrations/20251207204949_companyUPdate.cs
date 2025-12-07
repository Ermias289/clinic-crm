using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class companyUPdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfessionalName",
                table: "MedicalProfessionals",
                newName: "JobTitle");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddDoctorSchedule",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanAddWorkingSetting",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditDoctorSchedule",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditWorkingSetting",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewDoctorSchedule",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Workdays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Day = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpeningTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    ClosingTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    IsWorkingDay = table.Column<bool>(type: "bit", nullable: false),
                    CompanySettingId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workdays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workdays_CompanySetting_CompanySettingId",
                        column: x => x.CompanySettingId,
                        principalTable: "CompanySetting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Workdays_CompanySettingId",
                table: "Workdays",
                column: "CompanySettingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Workdays");

            migrationBuilder.DropColumn(
                name: "CanAddDoctorSchedule",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanAddWorkingSetting",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditDoctorSchedule",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditWorkingSetting",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewDoctorSchedule",
                table: "UserRoles");

            migrationBuilder.RenameColumn(
                name: "JobTitle",
                table: "MedicalProfessionals",
                newName: "ProfessionalName");
        }
    }
}
