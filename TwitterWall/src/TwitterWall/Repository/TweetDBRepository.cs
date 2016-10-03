using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using Microsoft.EntityFrameworkCore;
using TwitterWall.Context;

namespace TwitterWall.Repository
{
    public class TweetDBRepository : IRepository<Tweet>
    {
        TweetContext context;

        public TweetDBRepository()
        {            
            var optionsBuilder = new DbContextOptionsBuilder<TweetContext>();
            optionsBuilder.UseSqlServer(Startup.ConnectionString);
            context = new TweetContext(optionsBuilder.Options);
        }

        public TweetDBRepository(TweetContext ctx)
        {
            context = ctx;
        }

        public Tweet Get(long id)
        {
            return context.Tweets.Where(t => t.Id == id).SingleOrDefault();
        }

        public IEnumerable<Tweet> GetAll()
        {
            return context.Tweets.Include(t=>t.MediaList);
        }

        public IEnumerable<Tweet> Find(Func<Tweet, bool> exp)
        {
            return context.Tweets.Include(t => t.MediaList).Where<Tweet>(exp);
        }

        public void Add(Tweet entity)
        {
            context.Tweets.Add(entity);
            context.SaveChanges();
        }

        public void Remove(long id)
        {
            context.Tweets.Remove(Get(id));
            context.SaveChanges();
        }
    }
}
