using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class roleUpdateone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CanDeleteUser",
                table: "UserRoles",
                newName: "CanViewUser");

            migrationBuilder.AddColumn<bool>(
                name: "CanAddRole",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanEditRole",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanViewRole",
                table: "UserRoles",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanAddRole",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanEditRole",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CanViewRole",
                table: "UserRoles");

            migrationBuilder.RenameColumn(
                name: "CanViewUser",
                table: "UserRoles",
                newName: "CanDeleteUser");
        }
    }
}
