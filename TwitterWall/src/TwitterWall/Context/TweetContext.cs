using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Utility;

namespace TwitterWall.Context
{
    public class TweetContext : DbContext
    {
        private string connectionString;
        public TweetContext() : base()
        {
            connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
            if (String.IsNullOrEmpty(connectionString))
            {
                JObject result = JsonParser.GetConfig();
                connectionString = result["ConnectionString"].ToString();
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(connectionString);
        }

        public virtual DbSet<Tweet> Tweets { get; set; }
        public virtual DbSet<MediaUrl> MediaUrls { get; set; }
        public virtual DbSet<Sticky> Sticky { get; set; }
    }
}
