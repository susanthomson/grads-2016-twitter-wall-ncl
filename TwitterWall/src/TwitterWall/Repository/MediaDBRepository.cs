using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class MediaDBRepository : IRepository<MediaUrl>
    {
        TweetContext context;

        public MediaDBRepository()
        {
            var optionsBuilder = new DbContextOptionsBuilder<TweetContext>();
            optionsBuilder.UseSqlServer(Startup.ConnectionString);
            context = new TweetContext(optionsBuilder.Options);
        }

        public MediaDBRepository(TweetContext ctx)
        {
            context = ctx;
        }

        public MediaUrl Get(long id)
        {
            return context.MediaUrls.Where(m => m.Id == id).SingleOrDefault();
        }

        public IEnumerable<MediaUrl> GetAll()
        {
            return context.MediaUrls; 
        }

        public IEnumerable<MediaUrl> Find(Func<MediaUrl, bool> exp)
        {
            return context.MediaUrls.Where<MediaUrl>(exp);
        }

        public void Add(MediaUrl entity)
        {
            context.MediaUrls.Add(entity);
            context.SaveChanges();
        }

        public void Remove(long id)
        {
            context.MediaUrls.Remove(Get(id));
            context.SaveChanges();
        }

        public void AddFromTweet(Tweetinvi.Models.ITweet tweet)
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
