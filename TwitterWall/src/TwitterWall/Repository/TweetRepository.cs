using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;

namespace TwitterWall.Repository
{
    public class TweetRepository : IRepository<Tweet>
    {
        private List<Tweet> _tweetRepository = new List<Tweet>();

        public Tweet Get(int id)
        {
            return _tweetRepository.Find(t => t.Id == id);
        }

        public IEnumerable<Tweet> GetAll()
        {
            return _tweetRepository;
        }

        public IEnumerable<Tweet> Find(Func<Tweet, bool> exp)
        {
            return _tweetRepository.Where<Tweet>(exp);
        }

        public void Add(Tweet entity)
        {
            _tweetRepository.Add(entity);
        }

        public void Remove(int id)
        {
            _tweetRepository.Remove(_tweetRepository.Find(t => t.Id == id));
        }
    }
}
