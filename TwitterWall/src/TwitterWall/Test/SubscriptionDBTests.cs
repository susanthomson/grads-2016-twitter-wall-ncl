using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Utility;
using Xunit;

namespace TwitterWall.Test
{
    public class SubscriptionDBTests
    {
        public SubscriptionDBTests()
        {
        }

        private Mock<DbSet<Subscription>> setUpAsQueriable(IQueryable<Subscription> data)
        {
            var queriable = new Mock<DbSet<Subscription>>();
            queriable.As<IQueryable<Subscription>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<Subscription>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<Subscription>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<Subscription>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }

        [Fact]
        public void TestAdd()
        {
            //Setup
            var subscriptions = new List<Subscription>()
            {
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            Subscription newSubscription = new Subscription() { Id = 3, Value = "Track", Type = "Track" };
            repo.Add(newSubscription);

            // Act
            var result = repo.Get(newSubscription.Id);

            // Assert
            Assert.Equal(result, newSubscription);
        }

        [Fact]
        public void TestRemove()
        {
            //Setup
            var subscriptions = new List<Subscription>()
            {
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            Subscription newSubscription = new Subscription() { Id = 3, Value = "Track", Type = "Track" };
            repo.Add(newSubscription);

            // Act
            repo.Remove(3);

            // Assert
            Assert.Equal(0, subscriptions.Count);
        }

        [Fact]
        public void TestGet()
        {
            Subscription newSubscription = new Subscription() { Id = 3, Value = "Track", Type = "Track" };
            //Setup
            var subscriptions = new List<Subscription>()
            {
                newSubscription
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            // Act
            var result = repo.Get(newSubscription.Id);

            // Assert
            Assert.Equal(result, newSubscription);
        }

        [Fact]
        public void TestGetAllTracks()
        {
            Subscription newTrack = new Subscription() { Id = 3, Value = "A", Type = Common.SubType.TRACK.ToString() };
            Subscription newSpeaker = new Subscription() { Id = 4, Value = "A", Type = Common.SubType.PERSON.ToString() };

            //Setup
            var subscriptions = new List<Subscription>()
            {
                newTrack, newSpeaker
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            // Act
            var result = repo.GetAll(Common.SubType.TRACK);

            // Assert
            Assert.Equal(result.ToList().First(), newTrack);
        }

        [Fact]
        public void CheckTwitterId()
        {
            Subscription newSubscription = new Subscription() { Id = 3, Value = "Track", Type = "Track" };
            //Setup
            var subscriptions = new List<Subscription>()
            {
                newSubscription
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            // Act
            var result = repo.Get(3);

            // Assert
            Assert.Equal(result.TwitterId, 0);
        }

        [Fact]
        public void GetNonExistantItem()
        {
            Subscription newSubscription = new Subscription() { Id = 3, Value = "Track", Type = "Track" };
            //Setup
            var subscriptions = new List<Subscription>()
            {
                newSubscription
            };
            var data = subscriptions.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<Subscription>())).Callback<Subscription>((r) => subscriptions.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Subscriptions).Returns(mockSet.Object);

            // Arrange
            SubscriptionDBRepository repo = new SubscriptionDBRepository(mockContext.Object);
            // Act
            var result = repo.Get(6);

            // Assert
            Assert.Null(result);
        }
    }
}
