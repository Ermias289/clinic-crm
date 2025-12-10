using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class MedicalProfessional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsIdId",
                table: "MedicalProfessionalMedicalService");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalServices_DentistryServicesId",
                table: "MedicalProfessionalMedicalService");

            migrationBuilder.DropColumn(
                name: "MedicalProfessionals",
                table: "MedicalServices");

            migrationBuilder.DropColumn(
                name: "DentistryServicesId",
                table: "MedicalProfessionals");

            migrationBuilder.RenameColumn(
                name: "MedicalProfessionalsIdId",
                table: "MedicalProfessionalMedicalService",
                newName: "MedicalServicesId");

            migrationBuilder.RenameColumn(
                name: "DentistryServicesId",
                table: "MedicalProfessionalMedicalService",
                newName: "MedicalProfessionalsId");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalProfessionalMedicalService_MedicalProfessionalsIdId",
                table: "MedicalProfessionalMedicalService",
                newName: "IX_MedicalProfessionalMedicalService_MedicalServicesId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalProfessionalsId",
                principalTable: "MedicalProfessionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalServices_MedicalServicesId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalServicesId",
                principalTable: "MedicalServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsId",
                table: "MedicalProfessionalMedicalService");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalServices_MedicalServicesId",
                table: "MedicalProfessionalMedicalService");

            migrationBuilder.RenameColumn(
                name: "MedicalServicesId",
                table: "MedicalProfessionalMedicalService",
                newName: "MedicalProfessionalsIdId");

            migrationBuilder.RenameColumn(
                name: "MedicalProfessionalsId",
                table: "MedicalProfessionalMedicalService",
                newName: "DentistryServicesId");

            migrationBuilder.RenameIndex(
                name: "IX_MedicalProfessionalMedicalService_MedicalServicesId",
                table: "MedicalProfessionalMedicalService",
                newName: "IX_MedicalProfessionalMedicalService_MedicalProfessionalsIdId");

            migrationBuilder.AddColumn<string>(
                name: "MedicalProfessionals",
                table: "MedicalServices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DentistryServicesId",
                table: "MedicalProfessionals",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsIdId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalProfessionalsIdId",
                principalTable: "MedicalProfessionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionalMedicalService_MedicalServices_DentistryServicesId",
                table: "MedicalProfessionalMedicalService",
                column: "DentistryServicesId",
                principalTable: "MedicalServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
