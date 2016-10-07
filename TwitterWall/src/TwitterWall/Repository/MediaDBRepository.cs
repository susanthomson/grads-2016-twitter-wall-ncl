using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class MediaDBRepository : Repository<MediaUrl>
    {
        public MediaDBRepository() : base()
        {
        }

        public MediaDBRepository(TweetContext ctx) : base(ctx)
        {
        }

        public override MediaUrl Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.MediaUrls.Where(m => m.Id == id).SingleOrDefault();
            }                
        }

        public override IEnumerable<MediaUrl> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.MediaUrls;
            }
        }

        public override IEnumerable<MediaUrl> Find(Func<MediaUrl, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.MediaUrls.Where<MediaUrl>(exp);
            }
        }

        public override void Add(MediaUrl entity)
        {
            using (TweetContext context = GetContext())
            {
                context.Attach(entity.Tweet);
                context.MediaUrls.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                context.MediaUrls.Remove(Get(id));
                context.SaveChanges();
            }
        }

        public void AddFromTweet(Tweetinvi.Models.ITweet tweet)
        {
            using (TweetContext context = GetContext())
            {
                Tweet result = context.Tweets.Where(t => t.TweetId == tweet.Id).SingleOrDefault();
                if (result != null)
                {
                    List<Tweetinvi.Models.Entities.IMediaEntity> mediaEntities = tweet.Media.Where(e => e.MediaType.Equals("photo")).ToList();
                    foreach (Tweetinvi.Logic.TwitterEntities.MediaEntity entity in mediaEntities)
                    {
                        Add(new MediaUrl(entity.MediaURL, result));
                    }
                }
            }
        }
    }
}
