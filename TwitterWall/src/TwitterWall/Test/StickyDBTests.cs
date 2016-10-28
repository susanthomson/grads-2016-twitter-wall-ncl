using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Context;
using TwitterWall.Models;
using TwitterWall.Repository;
using Xunit;

namespace TwitterWall.Test
{
    public class StickyDBTests
    {
        public StickyDBTests()
        {
        }

        private Mock<DbSet<Sticky>> setUpAsQueriable(IQueryable<Sticky> data)
        {
            var queriable = new Mock<DbSet<Sticky>>();
            queriable.As<IQueryable<Sticky>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<Sticky>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<Sticky>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<Sticky>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }
        
        [Fact]
        public void TestAdd()
        {
            //Setup            
            var stickies = new List<Sticky>()
            {
            };
            var data = stickies.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Add(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Sticky).Returns(urlMockSet.Object);

            // Arrange
            StickyDBRepository repo = new StickyDBRepository(mockContext.Object);
            Sticky newSticky = new Sticky() { Id = 1, Tweet = new Tweet() { Id = 2 } };
            repo.Add(newSticky);

            // Act
            var mediaResult = repo.Get(1);

            // Assert
            Assert.NotNull(mediaResult);
        }
        
        [Fact]
        public void TestRemove()
        {
            Sticky sticky = new Sticky() { Id = 1, Tweet = new Tweet() { Id = 2 } };
            //Setup            
            var stickies = new List<Sticky>()
            {
                sticky
            };
            var data = stickies.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Sticky).Returns(urlMockSet.Object);

            // Arrange
            StickyDBRepository repo = new StickyDBRepository(mockContext.Object);

            // Act
            repo.Remove(1);

            // Assert
            Assert.Null(repo.Get(1));
        }
        
        [Fact]
        public void TestGet()
        {
            Sticky sticky = new Sticky() { Id = 1, Tweet = new Tweet() { Id = 2 } };
            //Setup            
            var stickies = new List<Sticky>()
            {
                sticky
            };
            var data = stickies.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Sticky).Returns(urlMockSet.Object);

            // Arrange
            StickyDBRepository repo = new StickyDBRepository(mockContext.Object);

            // Assert
            Assert.Equal(sticky, repo.Get(1));
        }
        
        [Fact]
        public void GetNonExistantItem()
        {
            Sticky sticky = new Sticky() { Id = 1, Tweet = new Tweet() { Id = 2 } };
            //Setup            
            var stickies = new List<Sticky>()
            {
                sticky
            };
            var data = stickies.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<Sticky>())).Callback<Sticky>((r) => stickies.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Sticky).Returns(urlMockSet.Object);

            // Arrange
            StickyDBRepository repo = new StickyDBRepository(mockContext.Object);

            // Act
            Sticky result = repo.Get(10);

            // Assert
            Assert.Null(result);
        }
    }
}
