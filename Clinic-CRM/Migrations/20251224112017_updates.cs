using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class updates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ServiceReference",
                table: "MedicalServices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "MedicalProfessionals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "MedicalProfessionals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Appointments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Reference",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateAt",
                table: "Appointments",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_UserId",
                table: "MedicalProfessionals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionals_Users_UserId",
                table: "MedicalProfessionals",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionals_Users_UserId",
                table: "MedicalProfessionals");

            migrationBuilder.DropIndex(
                name: "IX_MedicalProfessionals_UserId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "ServiceReference",
                table: "MedicalServices");

            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Reference",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "UpdateAt",
                table: "Appointments");
        }
    }
}
