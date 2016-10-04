using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class StickyDBRepository : IRepository<Sticky>
    {
        TweetContext context;

        public StickyDBRepository()
        {
            DbContextOptionsBuilder<TweetContext> optionsBuilder = new DbContextOptionsBuilder<TweetContext>();
            optionsBuilder.UseSqlServer(Startup.ConnectionString);
            context = new TweetContext(optionsBuilder.Options);
        }

        public StickyDBRepository(TweetContext ctx)
        {
            context = ctx;
        }

        public Sticky Get(long id)
        {
            return context.Sticky.Where(s => s.Id == id).SingleOrDefault();
        }

        public IEnumerable<Sticky> GetAll()
        {
            return context.Sticky;
        }

        public IEnumerable<Sticky> Find(Func<Sticky, bool> exp)
        {
            return context.Sticky.Where<Sticky>(exp);
        }

        public void Add(Sticky entity)
        {
            context.Sticky.Add(entity);
            context.SaveChanges();
        }

        public void Remove(long id)
        {
            Sticky sticky = Get(id);
            if (sticky != null)
            {
                context.Sticky.Remove(sticky);
                context.SaveChanges();
            }
        }

        public void RemoveByTweetId(long id)
        {
            Sticky sticky = context.Sticky.Include(s => s.Tweet).Where(s => s.Tweet.Id == id).SingleOrDefault();
            if (sticky != null)
            {
                context.Sticky.Remove(sticky);
                context.SaveChanges();
            }
        }

        public void Add(long tweetId)
        {
            Tweet tweet = context.Tweets.Where(t => t.Id == tweetId).SingleOrDefault();
            Sticky duplicateCheck = context.Sticky.Include(s => s.Tweet).Where(s => s.Tweet.Id == tweetId).SingleOrDefault();
            if (tweet != null && duplicateCheck == null)
            {
                Sticky sticky = new Sticky();
                sticky.Tweet = tweet;
                context.Sticky.Add(sticky);
                context.SaveChanges();
            }
        }
    }
}
