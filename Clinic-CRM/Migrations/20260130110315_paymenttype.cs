using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class paymenttype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsInsuranceCovered",
                table: "Payments",
                newName: "IsInsured");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddPaymentType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditPaymentType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewPaymentType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PaymentTypeId",
                table: "Payments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PaymentTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PaymentTypeId",
                table: "Payments",
                column: "PaymentTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_PaymentTypes_PaymentTypeId",
                table: "Payments",
                column: "PaymentTypeId",
                principalTable: "PaymentTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_PaymentTypes_PaymentTypeId",
                table: "Payments");

            migrationBuilder.DropTable(
                name: "PaymentTypes");

            migrationBuilder.DropIndex(
                name: "IX_Payments_PaymentTypeId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CanAddPaymentType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditPaymentType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewPaymentType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "PaymentTypeId",
                table: "Payments");

            migrationBuilder.RenameColumn(
                name: "IsInsured",
                table: "Payments",
                newName: "IsInsuranceCovered");
        }
    }
}
