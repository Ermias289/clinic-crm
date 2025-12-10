using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class MedicalServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DentistryServices",
                table: "MedicalProfessionals",
                newName: "DentistryServicesId");

            migrationBuilder.CreateTable(
                name: "MedicalProfessionalMedicalService",
                columns: table => new
                {
                    DentistryServicesId = table.Column<int>(type: "int", nullable: false),
                    MedicalProfessionalsIdId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalProfessionalMedicalService", x => new { x.DentistryServicesId, x.MedicalProfessionalsIdId });
                    table.ForeignKey(
                        name: "FK_MedicalProfessionalMedicalService_MedicalProfessionals_MedicalProfessionalsIdId",
                        column: x => x.MedicalProfessionalsIdId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalProfessionalMedicalService_MedicalServices_DentistryServicesId",
                        column: x => x.DentistryServicesId,
                        principalTable: "MedicalServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionalMedicalService_MedicalProfessionalsIdId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalProfessionalsIdId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalProfessionalMedicalService");

            migrationBuilder.RenameColumn(
                name: "DentistryServicesId",
                table: "MedicalProfessionals",
                newName: "DentistryServices");
        }
    }
}
