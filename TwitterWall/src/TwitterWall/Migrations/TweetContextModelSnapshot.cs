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
                .HasAnnotation("ProductVersion", "1.0.1");

            modelBuilder.Entity("TwitterWall.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("TwitterWall.Models.MediaUrl", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("TweetId")
                        .IsRequired();

                    b.Property<string>("Url")
                        .IsRequired();

                    b.Property<bool>("Visible");

                    b.HasKey("Id");

                    b.HasIndex("TweetId");

                    b.ToTable("MediaUrls");
                });

            modelBuilder.Entity("TwitterWall.Models.Subscription", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("EventId");

                    b.Property<long>("TwitterId");

                    b.Property<string>("Type")
                        .IsRequired();

                    b.Property<string>("Value")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("Subscriptions");
                });

            modelBuilder.Entity("TwitterWall.Models.Tweet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Body");

                    b.Property<DateTimeOffset>("Date");

                    b.Property<int?>("EventId");

                    b.Property<string>("Handle");

                    b.Property<string>("Name");

                    b.Property<string>("ProfileImage");

                    b.Property<bool>("Sticky");

                    b.Property<long>("TweetId");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("Tweets");
                });

            modelBuilder.Entity("TwitterWall.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("EventId");

                    b.Property<string>("Handle");

                    b.Property<string>("Type");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TwitterWall.Models.MediaUrl", b =>
                {
                    b.HasOne("TwitterWall.Models.Tweet", "Tweet")
                        .WithMany("MediaList")
                        .HasForeignKey("TweetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("TwitterWall.Models.Subscription", b =>
                {
                    b.HasOne("TwitterWall.Models.Event", "Event")
                        .WithMany("Subscriptions")
                        .HasForeignKey("EventId");
                });

            modelBuilder.Entity("TwitterWall.Models.Tweet", b =>
                {
                    b.HasOne("TwitterWall.Models.Event", "Event")
                        .WithMany("Tweets")
                        .HasForeignKey("EventId");
                });

            modelBuilder.Entity("TwitterWall.Models.User", b =>
                {
                    b.HasOne("TwitterWall.Models.Event", "Event")
                        .WithMany("Users")
                        .HasForeignKey("EventId");
                });
        }
    }
}
