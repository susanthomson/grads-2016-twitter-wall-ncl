using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class StickyDBRepository : Repository<Sticky>
    {
        public StickyDBRepository() : base()
        {
        }

        public StickyDBRepository(TweetContext ctx) : base(ctx)
        {
        }

        public override Sticky Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.Sticky.Where(s => s.Id == id).SingleOrDefault();
            }
        }

        public override IEnumerable<Sticky> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.Sticky;
            }
        }

        public override IEnumerable<Sticky> Find(Func<Sticky, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.Sticky.Where<Sticky>(exp);
            }
        }

        public override void Add(Sticky entity)
        {
            using (TweetContext context = GetContext())
            {
                context.Attach(entity.Tweet);
                context.Sticky.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                Sticky sticky = Get(id);
                if (sticky != null)
                {
                    context.Sticky.Remove(sticky);
                    context.SaveChanges();
                }
            }
        }

        public void RemoveByTweetId(long id)
        {
            using (TweetContext context = GetContext())
            {
                Sticky sticky = context.Sticky.Include(s => s.Tweet).Where(s => s.Tweet.Id == id).SingleOrDefault();
                if (sticky != null)
                {
                    context.Sticky.Remove(sticky);
                    context.SaveChanges();
                }
            }
        }

        public void Add(long tweetId, int eventId)
        {
            using (TweetContext context = GetContext())
            {
                Tweet tweet = context.Tweets.Where(t => t.Id == tweetId).SingleOrDefault();
                Event ev = context.Events.Where(e => e.Id == eventId).SingleOrDefault();
                Sticky duplicateCheck = context.Sticky.Include(s => s.Tweet).Where(s => s.Tweet.Id == tweetId).SingleOrDefault();
                if (tweet != null && duplicateCheck == null && ev != null)
                {
                    Sticky sticky = new Sticky();
                    sticky.Tweet = tweet;
                    sticky.Event = ev;
                    context.Sticky.Add(sticky);
                    context.SaveChanges();
                }
            }
        }
    }
}
