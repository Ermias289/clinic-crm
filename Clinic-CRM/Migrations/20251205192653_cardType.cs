using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class cardType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fullname",
                table: "Users");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddCardType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditCardType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewCardType",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "CardTypeId",
                table: "CardSettings",
                type: "int",
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_CardSettings_CardTypeId",
                table: "CardSettings",
                column: "CardTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CardSettings_CardTypes_CardTypeId",
                table: "CardSettings",
                column: "CardTypeId",
                principalTable: "CardTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardSettings_CardTypes_CardTypeId",
                table: "CardSettings");

            migrationBuilder.DropTable(
                name: "CardTypes");

            migrationBuilder.DropIndex(
                name: "IX_CardSettings_CardTypeId",
                table: "CardSettings");

            migrationBuilder.DropColumn(
                name: "CanAddCardType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditCardType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewCardType",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CardTypeId",
                table: "CardSettings");

            migrationBuilder.AddColumn<string>(
                name: "Fullname",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
