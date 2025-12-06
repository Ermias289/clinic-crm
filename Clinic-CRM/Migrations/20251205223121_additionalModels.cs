using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class additionalModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchSetting_CompanySetting_CompanySettingId",
                table: "BranchSetting");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchSetting",
                table: "BranchSetting");

            migrationBuilder.RenameTable(
                name: "BranchSetting",
                newName: "BranchSettings");

            migrationBuilder.RenameIndex(
                name: "IX_BranchSetting_CompanySettingId",
                table: "BranchSettings",
                newName: "IX_BranchSettings_CompanySettingId");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddBranchSetting",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanAddPatient",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditBranchSetting",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditPatient",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewBranchSetting",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewPatient",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchSettings",
                table: "BranchSettings",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DentistryServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationInMinutes = table.Column<int>(type: "int", nullable: false),
                    ServicePicture = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "MedicalProfessionals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfessionalName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EducationalBackground = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfilePicture = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiresUserAccount = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalProfessionals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalProfessionals_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Alergies = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChronicConditions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContactName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    RequiresUserAccount = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DentistryServiceMedicalProfessional",
                columns: table => new
                {
                    DentistryServicesId = table.Column<int>(type: "int", nullable: false),
                    MedicalProfessionalsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DentistryServiceMedicalProfessional", x => new { x.DentistryServicesId, x.MedicalProfessionalsId });
                    table.ForeignKey(
                        name: "FK_DentistryServiceMedicalProfessional_DentistryServices_DentistryServicesId",
                        column: x => x.DentistryServicesId,
                        principalTable: "DentistryServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DentistryServiceMedicalProfessional_MedicalProfessionals_MedicalProfessionalsId",
                        column: x => x.MedicalProfessionalsId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoctorSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalProfessionalId = table.Column<int>(type: "int", nullable: false),
                    WeekDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorSchedules_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DoctorSchedules_MedicalProfessionals_MedicalProfessionalId",
                        column: x => x.MedicalProfessionalId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CardNumebr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    PatientId = table.Column<int>(type: "int", nullable: true),
                    CardTypeId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cards_CardTypes_CardTypeId",
                        column: x => x.CardTypeId,
                        principalTable: "CardTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Cards_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Cards_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DentistryServiceId = table.Column<int>(type: "int", nullable: false),
                    DentistryId = table.Column<int>(type: "int", nullable: false),
                    MedicalProfessionalId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CardId = table.Column<int>(type: "int", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointment_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointment_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointment_DentistryServices_DentistryServiceId",
                        column: x => x.DentistryServiceId,
                        principalTable: "DentistryServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointment_MedicalProfessionals_MedicalProfessionalId",
                        column: x => x.MedicalProfessionalId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointment_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointment_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_BranchSettingId",
                table: "Appointment",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_CardId",
                table: "Appointment",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_DentistryServiceId",
                table: "Appointment",
                column: "DentistryServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_MedicalProfessionalId",
                table: "Appointment",
                column: "MedicalProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_PatientId",
                table: "Appointment",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_UserId",
                table: "Appointment",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_CardTypeId",
                table: "Cards",
                column: "CardTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PatientId",
                table: "Cards",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_UserId",
                table: "Cards",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DentistryServiceMedicalProfessional_MedicalProfessionalsId",
                table: "DentistryServiceMedicalProfessional",
                column: "MedicalProfessionalsId");

            migrationBuilder.CreateIndex(
                name: "IX_DentistryServices_BranchSettingId",
                table: "DentistryServices",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_BranchSettingId",
                table: "DoctorSchedules",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_MedicalProfessionalId",
                table: "DoctorSchedules",
                column: "MedicalProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_BranchSettingId",
                table: "MedicalProfessionals",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_UserId",
                table: "Patients",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BranchSettings_CompanySetting_CompanySettingId",
                table: "BranchSettings",
                column: "CompanySettingId",
                principalTable: "CompanySetting",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BranchSettings_CompanySetting_CompanySettingId",
                table: "BranchSettings");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "DentistryServiceMedicalProfessional");

            migrationBuilder.DropTable(
                name: "DoctorSchedules");

            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "DentistryServices");

            migrationBuilder.DropTable(
                name: "MedicalProfessionals");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BranchSettings",
                table: "BranchSettings");

            migrationBuilder.DropColumn(
                name: "CanAddBranchSetting",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanAddPatient",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditBranchSetting",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditPatient",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewBranchSetting",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewPatient",
                table: "UserRoles");

            migrationBuilder.RenameTable(
                name: "BranchSettings",
                newName: "BranchSetting");

            migrationBuilder.RenameIndex(
                name: "IX_BranchSettings_CompanySettingId",
                table: "BranchSetting",
                newName: "IX_BranchSetting_CompanySettingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BranchSetting",
                table: "BranchSetting",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BranchSetting_CompanySetting_CompanySettingId",
                table: "BranchSetting",
                column: "CompanySettingId",
                principalTable: "CompanySetting",
                principalColumn: "Id");
        }
    }
}
