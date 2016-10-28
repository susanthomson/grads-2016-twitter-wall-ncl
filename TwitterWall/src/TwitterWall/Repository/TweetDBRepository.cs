using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using Microsoft.EntityFrameworkCore;
using TwitterWall.Context;

namespace TwitterWall.Repository
{
    public class TweetDBRepository : Repository<Tweet>
    {
        public TweetDBRepository() : base()
        {
        }

        public TweetDBRepository(TweetContext ctx) : base(ctx)
        {
        }

        public override Tweet Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.Tweets.Where(t => t.Id == id).SingleOrDefault();
            }
        }

        public override IEnumerable<Tweet> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.Tweets.Include(t => t.MediaList).Include(t=>t.StickyList).ToList();
            }
        }

        public IEnumerable<Tweet> GetLatest(int limit, string eventName)
        {
            using (TweetContext context = GetContext())
            {
                Event ev = context.Events.Where(e => e.Name == eventName).SingleOrDefault();
                if (ev != null)
                {
                    List<Tweet> result = new List<Tweet>();
                    // Prioritise stickies
                    result.AddRange(context.Tweets.Where(t => t.StickyList.Count > 0 && t.Event.Name == ev.Name).Include(t => t.StickyList).Include(t => t.MediaList));
                    int fill = limit - result.Count;
                    if (fill > 0)
                    {
                        List<Tweet> latestNonStickyTweets = new List<Tweet>();
                        latestNonStickyTweets.AddRange(context.Tweets.OrderByDescending(t => t.Date).Include(t => t.StickyList).Include(t => t.MediaList).Where(t => t.StickyList.Count == 0 && t.Event.Name == ev.Name).Take(fill));
                        latestNonStickyTweets.Reverse();
                        result.AddRange(latestNonStickyTweets);
                    }
                    return result;
                }
                return null;
            }
        }

        public override IEnumerable<Tweet> Find(Func<Tweet, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.Tweets.Include(t => t.MediaList).Include(t=>t.StickyList).Include(t=>t.Event).Where<Tweet>(exp).ToList();
            }
        }

        public override void Add(Tweet entity)
        {
            using (TweetContext context = GetContext())
            {
                context.Attach(entity.Event);
                context.Tweets.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                Tweet tweet = Get(id);
                if (tweet != null)
                {
                    context.Attach(tweet);
                    context.Tweets.Remove(tweet);
                    context.SaveChanges();
                }
            }
        }
    }
}
