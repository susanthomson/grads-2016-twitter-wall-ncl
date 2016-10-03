using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;

namespace TwitterWall.Context
{
    public class TweetContext : DbContext
    {
        public TweetContext(DbContextOptions<TweetContext> options) : base(options)
        {

        }

        public virtual DbSet<Tweet> Tweets { get; set; }
        public virtual DbSet<MediaUrl> MediaUrls { get; set; }
    }
}
