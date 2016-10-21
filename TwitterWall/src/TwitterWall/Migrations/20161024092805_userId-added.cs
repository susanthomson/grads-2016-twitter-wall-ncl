using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TwitterWall.Migrations
{
    public partial class userIdadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
  
            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "Tweets",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Tweets");
        }
    }
}
