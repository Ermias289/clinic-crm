using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class MigrationRestore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CardTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompanySetting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Logo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prefix = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanySetting", x => x.Id);
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
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Specialty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EducationalBackground = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    YearsOfExperience = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfilePicture = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiresUserAccount = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalProfessionals", x => x.Id);
                });

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
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalServices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserOnBoardingSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PictureUploaded = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserOnBoardingSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CanEditCompanySettings = table.Column<bool>(type: "bit", nullable: false),
                    CanViewCompanySettings = table.Column<bool>(type: "bit", nullable: false),
                    CanAddUser = table.Column<bool>(type: "bit", nullable: false),
                    CanViewUser = table.Column<bool>(type: "bit", nullable: false),
                    CanEditUser = table.Column<bool>(type: "bit", nullable: false),
                    CanAddRole = table.Column<bool>(type: "bit", nullable: false),
                    CanViewRole = table.Column<bool>(type: "bit", nullable: false),
                    CanEditRole = table.Column<bool>(type: "bit", nullable: false),
                    CanAddUserOnBoarding = table.Column<bool>(type: "bit", nullable: false),
                    CanEditUserOnBoarding = table.Column<bool>(type: "bit", nullable: false),
                    CanViewUserOnBoardingSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanAddCardSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanViewCardSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanEditCardSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanAddCardType = table.Column<bool>(type: "bit", nullable: false),
                    CanEditCardType = table.Column<bool>(type: "bit", nullable: false),
                    CanViewCardType = table.Column<bool>(type: "bit", nullable: false),
                    CanAddBranchSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanViewBranchSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanEditBranchSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanAddPatient = table.Column<bool>(type: "bit", nullable: false),
                    CanEditPatient = table.Column<bool>(type: "bit", nullable: false),
                    CanViewPatient = table.Column<bool>(type: "bit", nullable: false),
                    CanAddDoctorSchedule = table.Column<bool>(type: "bit", nullable: false),
                    CanEditDoctorSchedule = table.Column<bool>(type: "bit", nullable: false),
                    CanViewDoctorSchedule = table.Column<bool>(type: "bit", nullable: false),
                    CanAddWorkingSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanEditWorkingSetting = table.Column<bool>(type: "bit", nullable: false),
                    CanRequestCard = table.Column<bool>(type: "bit", nullable: false),
                    CanViewCard = table.Column<bool>(type: "bit", nullable: false),
                    CanEditCard = table.Column<bool>(type: "bit", nullable: false),
                    CanApproveCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanCheckCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanRejectCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanViewCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanDeleteCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanCancelCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanEditCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanRequestCardPayment = table.Column<bool>(type: "bit", nullable: false),
                    CanMakeAppointment = table.Column<bool>(type: "bit", nullable: false),
                    CanCancelAppointment = table.Column<bool>(type: "bit", nullable: false),
                    CanCompleteAppointment = table.Column<bool>(type: "bit", nullable: false),
                    CanViewAppointment = table.Column<bool>(type: "bit", nullable: false),
                    CanEditAppointment = table.Column<bool>(type: "bit", nullable: false),
                    CanAddMedicalProfessional = table.Column<bool>(type: "bit", nullable: false),
                    CanEditMedicalProfessional = table.Column<bool>(type: "bit", nullable: false),
                    CanViewMedicalProfessional = table.Column<bool>(type: "bit", nullable: false),
                    CanAddMedicalService = table.Column<bool>(type: "bit", nullable: false),
                    CanUpdateMedicalService = table.Column<bool>(type: "bit", nullable: false),
                    CanViewMedicalService = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CardSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ExpirationDuration = table.Column<int>(type: "int", nullable: false),
                    CardTypeId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CardSettings_CardTypes_CardTypeId",
                        column: x => x.CardTypeId,
                        principalTable: "CardTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BranchSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanySettingId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BranchSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BranchSettings_CompanySetting_CompanySettingId",
                        column: x => x.CompanySettingId,
                        principalTable: "CompanySetting",
                        principalColumn: "Id");
                });

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

            migrationBuilder.CreateTable(
                name: "MedicalProfessionalMedicalService",
                columns: table => new
                {
                    MedicalProfessionalsId = table.Column<int>(type: "int", nullable: false),
                    MedicalServicesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalProfessionalMedicalService", x => new { x.MedicalProfessionalsId, x.MedicalServicesId });
                    table.ForeignKey(
                        name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsId",
                        column: x => x.MedicalProfessionalsId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalProfessionalMedicalService_MedicalServices_MedicalServicesId",
                        column: x => x.MedicalServicesId,
                        principalTable: "MedicalServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    UserRoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_UserRoles_UserRoleId",
                        column: x => x.UserRoleId,
                        principalTable: "UserRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BranchSettingMedicalProfessional",
                columns: table => new
                {
                    BranchesId = table.Column<int>(type: "int", nullable: false),
                    MedicalProfessionalsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BranchSettingMedicalProfessional", x => new { x.BranchesId, x.MedicalProfessionalsId });
                    table.ForeignKey(
                        name: "FK_BranchSettingMedicalProfessional_BranchSettings_BranchesId",
                        column: x => x.BranchesId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BranchSettingMedicalProfessional_MedicalProfessionals_MedicalProfessionalsId",
                        column: x => x.MedicalProfessionalsId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BranchSettingMedicalService",
                columns: table => new
                {
                    BranchesId = table.Column<int>(type: "int", nullable: false),
                    DentistryServicesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BranchSettingMedicalService", x => new { x.BranchesId, x.DentistryServicesId });
                    table.ForeignKey(
                        name: "FK_BranchSettingMedicalService_BranchSettings_BranchesId",
                        column: x => x.BranchesId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BranchSettingMedicalService_MedicalServices_DentistryServicesId",
                        column: x => x.DentistryServicesId,
                        principalTable: "MedicalServices",
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
                    BranchSettingId = table.Column<int>(type: "int", nullable: false),
                    WeekDay = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorSchedules_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DoctorSchedules_MedicalProfessionals_MedicalProfessionalId",
                        column: x => x.MedicalProfessionalId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DentistryServiceId = table.Column<int>(type: "int", nullable: false),
                    DentistryId = table.Column<int>(type: "int", nullable: false),
                    MedicalProfessionalId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: true),
                    BranchSettingId = table.Column<int>(type: "int", nullable: true),
                    BranchId = table.Column<int>(type: "int", nullable: true),
                    ReservationTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    Day = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompletedById = table.Column<int>(type: "int", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CanceledById = table.Column<int>(type: "int", nullable: true),
                    CanceledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CancelReason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointments_MedicalProfessionals_MedicalProfessionalId",
                        column: x => x.MedicalProfessionalId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_MedicalServices_DentistryServiceId",
                        column: x => x.DentistryServiceId,
                        principalTable: "MedicalServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_CanceledById",
                        column: x => x.CanceledById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointments_Users_CompletedById",
                        column: x => x.CompletedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CardNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CardTypeId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedById = table.Column<int>(type: "int", nullable: true),
                    RequestRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActivatedById = table.Column<int>(type: "int", nullable: true),
                    ActivationRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                        name: "FK_Cards_Users_ActivatedById",
                        column: x => x.ActivatedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Cards_Users_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "Users",
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
                    CardId1 = table.Column<int>(type: "int", nullable: true),
                    CardId = table.Column<int>(type: "int", nullable: true),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    RequiresUserAccount = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Patients_Cards_CardId1",
                        column: x => x.CardId1,
                        principalTable: "Cards",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Patients_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CardId = table.Column<int>(type: "int", nullable: false),
                    ExpectedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnPaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentProof = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RequestedById = table.Column<int>(type: "int", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedById = table.Column<int>(type: "int", nullable: true),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovalRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RejectedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RejectedById = table.Column<int>(type: "int", nullable: true),
                    RejectionRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckedById = table.Column<int>(type: "int", nullable: true),
                    CheckRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CanceledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CanceledById = table.Column<int>(type: "int", nullable: true),
                    CanceledRemark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_Users_ApprovedById",
                        column: x => x.ApprovedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_Users_CanceledById",
                        column: x => x.CanceledById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_Users_CheckedById",
                        column: x => x.CheckedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_Users_RejectedById",
                        column: x => x.RejectedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Payments_Users_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_BranchSettingId",
                table: "Appointments",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CanceledById",
                table: "Appointments",
                column: "CanceledById");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CompletedById",
                table: "Appointments",
                column: "CompletedById");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_MedicalProfessionalId",
                table: "Appointments",
                column: "MedicalProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_BranchSettingMedicalProfessional_MedicalProfessionalsId",
                table: "BranchSettingMedicalProfessional",
                column: "MedicalProfessionalsId");

            migrationBuilder.CreateIndex(
                name: "IX_BranchSettingMedicalService_DentistryServicesId",
                table: "BranchSettingMedicalService",
                column: "DentistryServicesId");

            migrationBuilder.CreateIndex(
                name: "IX_BranchSettings_CompanySettingId",
                table: "BranchSettings",
                column: "CompanySettingId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ActivatedById",
                table: "Cards",
                column: "ActivatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_CardTypeId",
                table: "Cards",
                column: "CardTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PatientId",
                table: "Cards",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_RequestedById",
                table: "Cards",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_CardSettings_CardTypeId",
                table: "CardSettings",
                column: "CardTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_BranchSettingId",
                table: "DoctorSchedules",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_MedicalProfessionalId",
                table: "DoctorSchedules",
                column: "MedicalProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionalMedicalService_MedicalServicesId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalServicesId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_CardId1",
                table: "Patients",
                column: "CardId1");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_UserId",
                table: "Patients",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ApprovedById",
                table: "Payments",
                column: "ApprovedById");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CanceledById",
                table: "Payments",
                column: "CanceledById");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CardId",
                table: "Payments",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CheckedById",
                table: "Payments",
                column: "CheckedById");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_RejectedById",
                table: "Payments",
                column: "RejectedById");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_RequestedById",
                table: "Payments",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserRoleId",
                table: "Users",
                column: "UserRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Workdays_CompanySettingId",
                table: "Workdays",
                column: "CompanySettingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Patients_PatientId",
                table: "Appointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "BranchSettingMedicalProfessional");

            migrationBuilder.DropTable(
                name: "BranchSettingMedicalService");

            migrationBuilder.DropTable(
                name: "CardSettings");

            migrationBuilder.DropTable(
                name: "DoctorSchedules");

            migrationBuilder.DropTable(
                name: "MedicalProfessionalMedicalService");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "UserOnBoardingSettings");

            migrationBuilder.DropTable(
                name: "Workdays");

            migrationBuilder.DropTable(
                name: "BranchSettings");

            migrationBuilder.DropTable(
                name: "MedicalProfessionals");

            migrationBuilder.DropTable(
                name: "MedicalServices");

            migrationBuilder.DropTable(
                name: "CompanySetting");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "CardTypes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserRoles");
        }
    }
}
