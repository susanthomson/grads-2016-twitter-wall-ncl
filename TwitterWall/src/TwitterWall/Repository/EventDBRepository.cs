using System;
using System.Collections.Generic;
using System.Linq;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class EventDBRepository : Repository<Event>
    {
        public EventDBRepository() : base()
        {
        }

        public EventDBRepository(TweetContext ctx) : base(ctx)
        {
        }

        public override Event Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.Events.Where(e => e.Id == id).SingleOrDefault();
            }
        }

        public override IEnumerable<Event> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.Events.ToList();
            }
        }

        public override IEnumerable<Event> Find(Func<Event, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.Events.Where<Event>(exp).ToList();
            }
        }

        public override void Add(Event entity)
        {
            using (TweetContext context = GetContext())
            {
                context.Events.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                Event e = Get(id);
                if (e != null)
                {
                    List<Tweet> tweets = context.Tweets.Where(t => t.Event.Id == e.Id).ToList();
                    List<User> users = context.Users.Where(u => u.Event.Id == e.Id).ToList();
                    List<Subscription> subs = context.Subscriptions.Where(s => s.Event.Id == e.Id).ToList();

                    context.Tweets.RemoveRange(tweets);
                    context.Users.RemoveRange(users);
                    context.Subscriptions.RemoveRange(subs);

                    context.Attach(e);
                    context.Events.Remove(e);
                    context.SaveChanges();
                }
            }
        }
    }
}