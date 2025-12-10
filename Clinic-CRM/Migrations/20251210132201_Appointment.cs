using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class Appointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_BranchSettings_BranchSettingId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Cards_CardId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_DentistryServices_DentistryServiceId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_MedicalProfessionals_MedicalProfessionalId",
                table: "Appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_Patients_PatientId",
                table: "Appointment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Appointment",
                table: "Appointment");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_CardId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "CardId",
                table: "Appointment");

            migrationBuilder.RenameTable(
                name: "Appointment",
                newName: "Appointments");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_PatientId",
                table: "Appointments",
                newName: "IX_Appointments_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_MedicalProfessionalId",
                table: "Appointments",
                newName: "IX_Appointments_MedicalProfessionalId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_DentistryServiceId",
                table: "Appointments",
                newName: "IX_Appointments_DentistryServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_BranchSettingId",
                table: "Appointments",
                newName: "IX_Appointments_BranchSettingId");

            migrationBuilder.AddColumn<bool>(
                name: "CanCancelAppointment",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanCompleteAppointment",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditAppointment",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanMakeAppointment",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewAppointment",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CanceledAt",
                table: "Appointments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CanceledById",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Appointments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CompletedById",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeOnly>(
                name: "ReservationTime",
                table: "Appointments",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Appointments",
                table: "Appointments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CanceledById",
                table: "Appointments",
                column: "CanceledById");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_CompletedById",
                table: "Appointments",
                column: "CompletedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_BranchSettings_BranchSettingId",
                table: "Appointments",
                column: "BranchSettingId",
                principalTable: "BranchSettings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_DentistryServices_DentistryServiceId",
                table: "Appointments",
                column: "DentistryServiceId",
                principalTable: "DentistryServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_MedicalProfessionals_MedicalProfessionalId",
                table: "Appointments",
                column: "MedicalProfessionalId",
                principalTable: "MedicalProfessionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Patients_PatientId",
                table: "Appointments",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_CanceledById",
                table: "Appointments",
                column: "CanceledById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_CompletedById",
                table: "Appointments",
                column: "CompletedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_BranchSettings_BranchSettingId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_DentistryServices_DentistryServiceId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_MedicalProfessionals_MedicalProfessionalId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Patients_PatientId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_CanceledById",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_CompletedById",
                table: "Appointments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Appointments",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_CanceledById",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_CompletedById",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CanCancelAppointment",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanCompleteAppointment",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditAppointment",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanMakeAppointment",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewAppointment",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CanceledAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CanceledById",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CompletedById",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ReservationTime",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Appointments");

            migrationBuilder.RenameTable(
                name: "Appointments",
                newName: "Appointment");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointment",
                newName: "IX_Appointment_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_MedicalProfessionalId",
                table: "Appointment",
                newName: "IX_Appointment_MedicalProfessionalId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_DentistryServiceId",
                table: "Appointment",
                newName: "IX_Appointment_DentistryServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_BranchSettingId",
                table: "Appointment",
                newName: "IX_Appointment_BranchSettingId");

            migrationBuilder.AddColumn<int>(
                name: "CardId",
                table: "Appointment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Appointment",
                table: "Appointment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_CardId",
                table: "Appointment",
                column: "CardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_BranchSettings_BranchSettingId",
                table: "Appointment",
                column: "BranchSettingId",
                principalTable: "BranchSettings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Cards_CardId",
                table: "Appointment",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_DentistryServices_DentistryServiceId",
                table: "Appointment",
                column: "DentistryServiceId",
                principalTable: "DentistryServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_MedicalProfessionals_MedicalProfessionalId",
                table: "Appointment",
                column: "MedicalProfessionalId",
                principalTable: "MedicalProfessionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_Patients_PatientId",
                table: "Appointment",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
