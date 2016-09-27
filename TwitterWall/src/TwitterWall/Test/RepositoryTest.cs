using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Repository;
using Xunit;

namespace TwitterWall.Test
{
    public class RepositoryTest : IDisposable
    {
        TweetRepository repo;

        public RepositoryTest()
        {
            repo = new TweetRepository();
        }

        public void Dispose()
        {
            repo = null;
        }

        [Fact]
        public void RepositoryInitialisation()
        {
            Assert.Null(repo.GetAll().SingleOrDefault());
        }

        [Fact]
        public void AddToRepository()
        {
            repo.Add(new Models.Tweet());
            Assert.True(repo.GetAll().Count() == 1);
        }

        [Fact]
        public void RemoveFromRepository()
        {
            Tweet tweet = new Tweet();
            tweet.Id = 1;
            repo.Add(tweet);
            repo.Remove(tweet.Id);
            Assert.True(repo.GetAll().Count() == 0);
        }

        [Fact]
        public void FindItem()
        {
            Tweet tweet = new Tweet();
            tweet.Id = 1;
            repo.Add(tweet);
            repo.Add(new Tweet());

            Tweet result = repo.Find(t => t.Id == tweet.Id).SingleOrDefault();
            Assert.True(result.Id == 1);
        }

        [Fact]
        public void GetFromRepository()
        {
            Tweet tweet = new Tweet();
            tweet.Id = 1;
            repo.Add(tweet);

            tweet = new Tweet();
            tweet.Id = 2;
            repo.Add(tweet);

            Assert.NotNull(repo.Get(2));
        }

        [Fact]
        public void RetrieveNonExistingItem()
        {
            Tweet tweet = new Tweet();
            tweet.Id = 1;
            repo.Add(tweet);
            Assert.Null(repo.Get(5));
        }

    }
}
