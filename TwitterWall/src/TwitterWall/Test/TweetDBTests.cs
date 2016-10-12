using Autofac;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;
using TwitterWall.Repository;
using Xunit;

namespace TwitterWall.Test
{
    public class TweetDBTests
    {
        public TweetDBTests()
        {
        }
        private Mock<DbSet<Tweet>> setUpAsQueriable(IQueryable<Tweet> data)
        {
            var queriable = new Mock<DbSet<Tweet>>();
            queriable.As<IQueryable<Tweet>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<Tweet>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<Tweet>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<Tweet>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }

        [Fact]
        public void TestAdd()
        {
            //Setup
            var tweets = new List<Tweet>()
            {
            };
            var data = tweets.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Tweets).Returns(mockSet.Object);

            // Arrange
            TweetDBRepository repo = new TweetDBRepository(mockContext.Object);
            Tweet newTweet = new Tweet() { Id = 3, MediaList = new List<MediaUrl>() };
            repo.Add(newTweet);

            // Act
            var tweetResult = repo.Get(newTweet.Id);

            // Asert
            Assert.Equal(tweetResult, newTweet);
        }

        [Fact]
        public void TestRemove()
        {
            //Setup
            var tweets = new List<Tweet>()
            {
                new Tweet() { Id = 3, MediaList = new List<MediaUrl>() }
            };
            var data = tweets.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Tweets).Returns(mockSet.Object);

            // Arrange
            TweetDBRepository repo = new TweetDBRepository(mockContext.Object);

            // Act
            repo.Remove(3);

            // Asert
            Assert.Equal(0, tweets.Count);
        }

        [Fact]
        public void TestGet()
        {
            Tweet tweet = new Tweet() { Id = 3, MediaList = new List<MediaUrl>() };
            //Setup
            var tweets = new List<Tweet>()
            {
                tweet
            };
            var data = tweets.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Tweets).Returns(mockSet.Object);

            // Arrange
            TweetDBRepository repo = new TweetDBRepository(mockContext.Object);

            // Act
            var tweetResult = repo.Get(3);

            // Asert
            Assert.Equal(tweetResult, tweet);
        }

        [Fact]
        public void GetNonExistantItem()
        {
            //Setup
            var tweets = new List<Tweet>()
            {
                new Tweet() { Id = 3, MediaList = new List<MediaUrl>() }
            };
            var data = tweets.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Tweet>())).Callback<Tweet>((r) => tweets.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Tweets).Returns(mockSet.Object);

            // Arrange
            TweetDBRepository repo = new TweetDBRepository(mockContext.Object);

            // Act
            var result = repo.Get(5);

            // Asert
            Assert.Null(result);
        }
    }
}
