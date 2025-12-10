using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class MedicalPro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DentistryServiceMedicalProfessional");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddMedicalProfessional",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditMedicalProfessional",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewMedicalProfessional",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DentistryServiceId",
                table: "MedicalProfessionals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DentistryServices",
                table: "MedicalProfessionals",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_DentistryServiceId",
                table: "MedicalProfessionals",
                column: "DentistryServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionals_DentistryServices_DentistryServiceId",
                table: "MedicalProfessionals",
                column: "DentistryServiceId",
                principalTable: "DentistryServices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionals_DentistryServices_DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropIndex(
                name: "IX_MedicalProfessionals_DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "CanAddMedicalProfessional",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditMedicalProfessional",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewMedicalProfessional",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "DentistryServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "DentistryServices",
                table: "MedicalProfessionals");

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

            migrationBuilder.CreateIndex(
                name: "IX_DentistryServiceMedicalProfessional_MedicalProfessionalsId",
                table: "DentistryServiceMedicalProfessional",
                column: "MedicalProfessionalsId");
        }
    }
}
