using System;
using System.Collections.Generic;

namespace TwitterWall.Repository
{
    public interface IRepository<T>
    {
        T Get(long id);

        IEnumerable<T> GetAll();

        IEnumerable<T> Find(Func<T, bool> exp);

        void Add(T entity);

        void Remove(long id);
    }
}