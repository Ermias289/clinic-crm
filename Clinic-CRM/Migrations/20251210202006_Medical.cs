using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class Medical : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_DentistryServices_DentistryServiceId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionals_DentistryServices_DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropTable(
                name: "DentistryServices");

            migrationBuilder.DropIndex(
                name: "IX_MedicalProfessionals_DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddMedicalService",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanUpdateMedicalService",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewMedicalService",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "MedicalServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationInMinutes = table.Column<int>(type: "int", nullable: false),
                    ServicePicture = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MedicalProfessionals = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalServices_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalServices_BranchSettingId",
                table: "MedicalServices",
                column: "BranchSettingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId",
                principalTable: "MedicalServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalServices_DentistryServiceId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "MedicalServices");

            migrationBuilder.DropColumn(
                name: "CanAddMedicalService",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanUpdateMedicalService",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewMedicalService",
                table: "UserRoles");

            migrationBuilder.AddColumn<int>(
                name: "DentistryServiceId",
                table: "MedicalProfessionals",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DentistryServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationInMinutes = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServicePicture = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DentistryServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DentistryServices_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_DentistryServiceId",
                table: "MedicalProfessionals",
                column: "DentistryServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_DentistryServices_BranchSettingId",
                table: "DentistryServices",
                column: "BranchSettingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_DentistryServices_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId",
                principalTable: "DentistryServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionals_DentistryServices_DentistryServiceId",
                table: "MedicalProfessionals",
                column: "DentistryServiceId",
                principalTable: "DentistryServices",
                principalColumn: "Id");
        }
    }
}
