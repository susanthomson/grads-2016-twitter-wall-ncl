using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;

namespace TwitterWall.Repository
{
    public abstract class Repository<T> : IRepository<T>
    {
        TweetContext context;

        public Repository()
        {
        }

        public Repository(TweetContext ctx)
        {
            context = ctx;
        }

        public TweetContext GetContext()
        {
            if (context == null)
            {
                return new TweetContext();
            }
            else
            {
                return context;
            }
        }

        public abstract T Get(long id);
        public abstract IEnumerable<T> GetAll();
        public abstract IEnumerable<T> Find(Func<T, bool> exp);
        public abstract void Add(T entity);
        public abstract void Remove(long id);
    }
}
