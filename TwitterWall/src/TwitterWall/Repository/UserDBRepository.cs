using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;
using Microsoft.EntityFrameworkCore;

namespace TwitterWall.Repository
{
    public class UserDBRepository : Repository<User>
    {
        public UserDBRepository()
        {

        }

        public UserDBRepository(TweetContext ctx) : base(ctx)
        {

        }

        public override User Get(long id)
        {
            using (TweetContext context = GetContext())
            {
                return context.Users.Where(u => u.Id == id).SingleOrDefault();
            }
        }

        public override IEnumerable<User> GetAll()
        {
            using (TweetContext context = GetContext())
            {
                return context.Users.ToList();
            }
        }

        public override IEnumerable<User> Find(Func<User, bool> exp)
        {
            using (TweetContext context = GetContext())
            {
                return context.Users.Include(u => u.Event).Where<User>(exp).ToList();
            }
        }

        public override void Add(User entity)
        {
            using (TweetContext context = GetContext())
            {
                if (entity.Event != null)
                {
                    context.Attach(entity.Event);
                }
                context.Users.Add(entity);
                context.SaveChanges();
            }
        }

        public override void Remove(long id)
        {
            using (TweetContext context = GetContext())
            {
                User user = Get(id);
                if (user != null)
                {
                    context.Users.Remove(user);
                    context.SaveChanges();
                }
            }
        }
    }
}

