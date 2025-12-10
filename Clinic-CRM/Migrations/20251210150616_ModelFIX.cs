using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class ModelFIX : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CardId",
                table: "Patients",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CardId1",
                table: "Patients",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Day",
                table: "Appointments",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.CreateIndex(
                name: "IX_Patients_CardId1",
                table: "Patients",
                column: "CardId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Cards_CardId1",
                table: "Patients",
                column: "CardId1",
                principalTable: "Cards",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Cards_CardId1",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Patients_CardId1",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "CardId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "CardId1",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Day",
                table: "Appointments");
        }
    }
}
