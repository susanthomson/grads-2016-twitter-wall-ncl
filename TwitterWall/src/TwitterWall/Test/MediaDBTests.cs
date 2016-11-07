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
    public class MediaDBTests
    {
        public MediaDBTests()
        {
        }

        private Mock<DbSet<MediaUrl>> setUpAsQueriable(IQueryable<MediaUrl> data)
        {
            var queriable = new Mock<DbSet<MediaUrl>>();
            queriable.As<IQueryable<MediaUrl>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<MediaUrl>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<MediaUrl>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<MediaUrl>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }

        [Fact]
        public void TestAdd()
        {
            //Setup
            var urls = new List<MediaUrl>()
            {
            };
            var data = urls.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.MediaUrls).Returns(urlMockSet.Object);

            // Arrange
            MediaDBRepository repo = new MediaDBRepository(mockContext.Object);
            MediaUrl newUrl = new MediaUrl() { Id = 1, Tweet = new Tweet() { Id = 0 } };
            repo.Add(newUrl);

            // Act
            var mediaResult = repo.Get(1);

            // Asert
            Assert.NotNull(mediaResult);
        }

        [Fact]
        public void TestRemove()
        {
            MediaUrl url = new MediaUrl() { Id = 1, Tweet = new Tweet() { Id = 0 } };
            //Setup
            var urls = new List<MediaUrl>()
            {
                url
            };
            var data = urls.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.MediaUrls).Returns(urlMockSet.Object);

            // Arrange
            MediaDBRepository repo = new MediaDBRepository(mockContext.Object);

            // Act
            repo.Remove(1);

            // Asert
            Assert.Null(repo.Get(1));
        }

        [Fact]
        public void TestGet()
        {
            MediaUrl url = new MediaUrl() { Id = 1, Tweet = new Tweet() { Id = 0 } };
            //Setup
            var urls = new List<MediaUrl>()
            {
                url
            };
            var data = urls.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.MediaUrls).Returns(urlMockSet.Object);

            // Arrange
            MediaDBRepository repo = new MediaDBRepository(mockContext.Object);

            // Act
            MediaUrl result = repo.Get(1);

            // Asert
            Assert.Equal(url, result);
        }

        [Fact]
        public void GetNonExistantItem()
        {
            MediaUrl url = new MediaUrl() { Id = 1, Tweet = new Tweet() { Id = 0 } };
            //Setup
            var urls = new List<MediaUrl>()
            {
                url
            };
            var data = urls.AsQueryable();
            var urlMockSet = setUpAsQueriable(data);
            urlMockSet.Setup(d => d.Add(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Add(r));
            urlMockSet.Setup(d => d.Remove(It.IsAny<MediaUrl>())).Callback<MediaUrl>((r) => urls.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.MediaUrls).Returns(urlMockSet.Object);

            // Arrange
            MediaDBRepository repo = new MediaDBRepository(mockContext.Object);

            // Act
            MediaUrl result = repo.Get(5);

            // Asert
            Assert.Null(result);
        }
    }
}