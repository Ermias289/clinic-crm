using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class cardUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Users_UserId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Users_UserId",
                table: "Patients");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Cards",
                newName: "RequestedById");

            migrationBuilder.RenameColumn(
                name: "CardNumebr",
                table: "Cards",
                newName: "RequestRemark");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_UserId",
                table: "Cards",
                newName: "IX_Cards_RequestedById");

            migrationBuilder.AddColumn<bool>(
                name: "CanRequestCard",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "Cards",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ActivatedAt",
                table: "Cards",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "ActivatedById",
                table: "Cards",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActivationRemark",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CardNumber",
                table: "Cards",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiredAt",
                table: "Cards",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "RequestedAt",
                table: "Cards",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Cards_ActivatedById",
                table: "Cards",
                column: "ActivatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Users_ActivatedById",
                table: "Cards",
                column: "ActivatedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Users_RequestedById",
                table: "Cards",
                column: "RequestedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Users_UserId",
                table: "Patients",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Users_ActivatedById",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Users_RequestedById",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_Users_UserId",
                table: "Patients");

            migrationBuilder.DropIndex(
                name: "IX_Cards_ActivatedById",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "CanRequestCard",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "ActivatedAt",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ActivatedById",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ActivationRemark",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "CardNumber",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ExpiredAt",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "RequestedAt",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "RequestedById",
                table: "Cards",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "RequestRemark",
                table: "Cards",
                newName: "CardNumebr");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_RequestedById",
                table: "Cards",
                newName: "IX_Cards_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "PatientId",
                table: "Cards",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Patients_PatientId",
                table: "Cards",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Users_UserId",
                table: "Cards",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_Users_UserId",
                table: "Patients",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
