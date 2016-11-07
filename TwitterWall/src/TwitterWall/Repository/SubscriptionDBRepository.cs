using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using TwitterWall.Context;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class SubscriptionDBRepository : Repository<Subscription>
    {
        public SubscriptionDBRepository()
        {
        }

        public SubscriptionDBRepository(TweetContext ctx) : base(ctx)
        {
        }

        public override Subscription Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.Subscriptions.Where(s => s.Id == id).SingleOrDefault();
            }
        }

        public override IEnumerable<Subscription> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.Subscriptions.ToList();
            }
        }

        public override IEnumerable<Subscription> Find(Func<Subscription, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.Subscriptions.Include(s => s.Event).Where<Subscription>(exp).ToList();
            }
        }

        public override void Add(Subscription entity)
        {
            using (TweetContext context = GetContext())
            {
                context.Attach(entity.Event);
                context.Subscriptions.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                Subscription subscription = Get(id);
                if (subscription != null)
                {
                    context.Subscriptions.Remove(subscription);
                    context.SaveChanges();
                }
            }
        }
    }
}