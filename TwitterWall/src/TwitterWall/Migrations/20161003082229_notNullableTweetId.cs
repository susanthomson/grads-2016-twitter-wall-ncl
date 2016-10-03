using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TwitterWall.Migrations
{
    public partial class notNullableTweetId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaUrls_Tweets_TweetId",
                table: "MediaUrls");

            migrationBuilder.AlterColumn<int>(
                name: "TweetId",
                table: "MediaUrls",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaUrls_Tweets_TweetId",
                table: "MediaUrls",
                column: "TweetId",
                principalTable: "Tweets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaUrls_Tweets_TweetId",
                table: "MediaUrls");

            migrationBuilder.AlterColumn<int>(
                name: "TweetId",
                table: "MediaUrls",
                nullable: false);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaUrls_Tweets_TweetId",
                table: "MediaUrls",
                column: "TweetId",
                principalTable: "Tweets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
