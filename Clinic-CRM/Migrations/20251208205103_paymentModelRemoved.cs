using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic_CRM.Migrations
{
    /// <inheritdoc />
    public partial class paymentModelRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Cards_CardId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Users_ApprovedById",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Users_CheckedById",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Users_CheckedById1",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Users_RejectedById",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Users_RequestedById",
                table: "Payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payments",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_CheckedById1",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CheckedById1",
                table: "Payments");

            migrationBuilder.RenameTable(
                name: "Payments",
                newName: "Payment");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_RequestedById",
                table: "Payment",
                newName: "IX_Payment_RequestedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_RejectedById",
                table: "Payment",
                newName: "IX_Payment_RejectedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_CheckedById",
                table: "Payment",
                newName: "IX_Payment_CheckedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_CardId",
                table: "Payment",
                newName: "IX_Payment_CardId");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_ApprovedById",
                table: "Payment",
                newName: "IX_Payment_ApprovedById");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payment",
                table: "Payment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_CanceledById",
                table: "Payment",
                column: "CanceledById");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Cards_CardId",
                table: "Payment",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Users_ApprovedById",
                table: "Payment",
                column: "ApprovedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Users_CanceledById",
                table: "Payment",
                column: "CanceledById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Users_CheckedById",
                table: "Payment",
                column: "CheckedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Users_RejectedById",
                table: "Payment",
                column: "RejectedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Users_RequestedById",
                table: "Payment",
                column: "RequestedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Cards_CardId",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Users_ApprovedById",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Users_CanceledById",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Users_CheckedById",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Users_RejectedById",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Users_RequestedById",
                table: "Payment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payment",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_Payment_CanceledById",
                table: "Payment");

            migrationBuilder.RenameTable(
                name: "Payment",
                newName: "Payments");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_RequestedById",
                table: "Payments",
                newName: "IX_Payments_RequestedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_RejectedById",
                table: "Payments",
                newName: "IX_Payments_RejectedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_CheckedById",
                table: "Payments",
                newName: "IX_Payments_CheckedById");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_CardId",
                table: "Payments",
                newName: "IX_Payments_CardId");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_ApprovedById",
                table: "Payments",
                newName: "IX_Payments_ApprovedById");

            migrationBuilder.AddColumn<int>(
                name: "CheckedById1",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payments",
                table: "Payments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CheckedById1",
                table: "Payments",
                column: "CheckedById1");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Cards_CardId",
                table: "Payments",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Users_ApprovedById",
                table: "Payments",
                column: "ApprovedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Users_CheckedById",
                table: "Payments",
                column: "CheckedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Users_CheckedById1",
                table: "Payments",
                column: "CheckedById1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Users_RejectedById",
                table: "Payments",
                column: "RejectedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Users_RequestedById",
                table: "Payments",
                column: "RequestedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
