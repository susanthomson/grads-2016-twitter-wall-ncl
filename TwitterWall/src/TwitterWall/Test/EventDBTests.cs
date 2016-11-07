using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using TwitterWall.Context;
using TwitterWall.Models;
using TwitterWall.Repository;
using Xunit;

namespace TwitterWall.Test
{
    public class EventDBTests
    {
        public EventDBTests()
        {
        }

        private Mock<DbSet<Event>> setUpAsQueriable(IQueryable<Event> data)
        {
            var queriable = new Mock<DbSet<Event>>();
            queriable.As<IQueryable<Event>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<Event>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<Event>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<Event>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }

        [Fact]
        public void TestAdd()
        {
            //Setup
            var events = new List<Event>()
            {
            };
            var data = events.AsQueryable();
            var eventMockSet = setUpAsQueriable(data);
            eventMockSet.Setup(d => d.Add(It.IsAny<Event>())).Callback<Event>((r) => events.Add(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Events).Returns(eventMockSet.Object);

            // Arrange
            EventDBRepository repo = new EventDBRepository(mockContext.Object);
            Event newEvent = new Event() { Id = 1 };
            repo.Add(newEvent);

            // Act
            var eventResult = repo.Get(1);

            // Assert
            Assert.NotNull(eventResult);
        }

        [Fact]
        public void TestGet()
        {
            //Setup
            Event ev = new Event() { Id = 1 };
            var events = new List<Event>()
            {
                ev
            };
            var data = events.AsQueryable();
            var eventMockSet = setUpAsQueriable(data);

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Events).Returns(eventMockSet.Object);

            // Arrange
            EventDBRepository repo = new EventDBRepository(mockContext.Object);

            // Assert
            Assert.Equal(ev, repo.Get(1));
        }

        [Fact]
        public void GetNonExistantItem()
        {
            //Setup
            Event ev = new Event() { Id = 1 };
            var events = new List<Event>()
            {
                ev
            };
            var data = events.AsQueryable();
            var eventMockSet = setUpAsQueriable(data);

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Events).Returns(eventMockSet.Object);

            // Arrange
            EventDBRepository repo = new EventDBRepository(mockContext.Object);

            // Act
            Event result = repo.Get(10);

            // Assert
            Assert.Null(result);
        }
    }
}