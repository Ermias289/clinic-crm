using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class docService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BranchSettingMedicalProfessional");

            migrationBuilder.DropTable(
                name: "MedicalProfessionalMedicalService");

            migrationBuilder.AddColumn<int>(
                name: "BranchSettingId",
                table: "MedicalProfessionals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MedicalServiceId",
                table: "MedicalProfessionals",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DocServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalProfessionalId = table.Column<int>(type: "int", nullable: false),
                    MedicalServiceId = table.Column<int>(type: "int", nullable: false),
                    BranchSettingId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocServices_BranchSettings_BranchSettingId",
                        column: x => x.BranchSettingId,
                        principalTable: "BranchSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocServices_MedicalProfessionals_MedicalProfessionalId",
                        column: x => x.MedicalProfessionalId,
                        principalTable: "MedicalProfessionals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocServices_MedicalServices_MedicalServiceId",
                        column: x => x.MedicalServiceId,
                        principalTable: "MedicalServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_BranchSettingId",
                table: "MedicalProfessionals",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionals_MedicalServiceId",
                table: "MedicalProfessionals",
                column: "MedicalServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_DocServices_BranchSettingId",
                table: "DocServices",
                column: "BranchSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_DocServices_MedicalProfessionalId",
                table: "DocServices",
                column: "MedicalProfessionalId");

            migrationBuilder.CreateIndex(
                name: "IX_DocServices_MedicalServiceId",
                table: "DocServices",
                column: "MedicalServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionals_BranchSettings_BranchSettingId",
                table: "MedicalProfessionals",
                column: "BranchSettingId",
                principalTable: "BranchSettings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalProfessionals_MedicalServices_MedicalServiceId",
                table: "MedicalProfessionals",
                column: "MedicalServiceId",
                principalTable: "MedicalServices",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionals_BranchSettings_BranchSettingId",
                table: "MedicalProfessionals");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalProfessionals_MedicalServices_MedicalServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropTable(
                name: "DocServices");

            migrationBuilder.DropIndex(
                name: "IX_MedicalProfessionals_BranchSettingId",
                table: "MedicalProfessionals");

            migrationBuilder.DropIndex(
                name: "IX_MedicalProfessionals_MedicalServiceId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "BranchSettingId",
                table: "MedicalProfessionals");

            migrationBuilder.DropColumn(
                name: "MedicalServiceId",
                table: "MedicalProfessionals");

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

            migrationBuilder.CreateIndex(
                name: "IX_BranchSettingMedicalProfessional_MedicalProfessionalsId",
                table: "BranchSettingMedicalProfessional",
                column: "MedicalProfessionalsId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalProfessionalMedicalService_MedicalServicesId",
                table: "MedicalProfessionalMedicalService",
                column: "MedicalServicesId");
        }
    }
}
