using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using TwitterWall.Context;

namespace TwitterWall.Migrations
{
    [DbContext(typeof(TweetContext))]
    partial class TweetContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TwitterWall.Models.MediaUrl", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("TweetId")
                        .IsRequired();

                    b.Property<string>("Url")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("TweetId");

                    b.ToTable("MediaUrls");
                });

            modelBuilder.Entity("TwitterWall.Models.Sticky", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("TweetId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("TweetId");

                    b.ToTable("Sticky");
                });

            modelBuilder.Entity("TwitterWall.Models.Tweet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Body");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Handle");

                    b.Property<string>("Name");

                    b.Property<string>("ProfileImage");

                    b.Property<long>("TweetId");

                    b.HasKey("Id");

                    b.ToTable("Tweets");
                });

            modelBuilder.Entity("TwitterWall.Models.MediaUrl", b =>
                {
                    b.HasOne("TwitterWall.Models.Tweet", "Tweet")
                        .WithMany("MediaList")
                        .HasForeignKey("TweetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("TwitterWall.Models.Sticky", b =>
                {
                    b.HasOne("TwitterWall.Models.Tweet", "Tweet")
                        .WithMany("StickyList")
                        .HasForeignKey("TweetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
