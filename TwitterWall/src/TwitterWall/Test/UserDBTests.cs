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
    public class UserDBTests
    {
        public UserDBTests()
        {
        }

        private Mock<DbSet<User>> setUpAsQueriable(IQueryable<User> data)
        {
            var queriable = new Mock<DbSet<User>>();
            queriable.As<IQueryable<User>>().Setup(m => m.Provider).Returns(() => data.Provider);
            queriable.As<IQueryable<User>>().Setup(m => m.Expression).Returns(() => data.Expression);
            queriable.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(() => data.ElementType);
            queriable.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(() => data.GetEnumerator());
            return queriable;
        }

        [Fact]
        public void TestAdd()
        {
            //Setup
            var Users = new List<User>()
            {
            };
            var data = Users.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<User>())).Callback<User>((r) => Users.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<User>())).Callback<User>((r) => Users.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Arrange
            UserDBRepository repo = new UserDBRepository(mockContext.Object);
            User newUser = new User() { Id = 3, Handle = "test", Type = "ADMIN" };
            repo.Add(newUser);

            // Act
            var result = repo.Get(newUser.Id);

            // Assert
            Assert.Equal(result, newUser);
        }

        [Fact]
        public void TestRemove()
        {
            //Setup
            var Users = new List<User>()
            {
            };
            var data = Users.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<User>())).Callback<User>((r) => Users.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<User>())).Callback<User>((r) => Users.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Arrange
            UserDBRepository repo = new UserDBRepository(mockContext.Object);
            User newUser = new User() { Id = 3, Handle = "test", Type = "ADMIN" };
            repo.Add(newUser);

            // Act
            repo.Remove(3);

            // Assert
            Assert.Equal(0, Users.Count);
        }

        [Fact]
        public void TestGet()
        {
            User newUser = new User() { Id = 3, Handle = "test", Type = "ADMIN" };
            //Setup
            var Users = new List<User>()
            {
                newUser
            };
            var data = Users.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<User>())).Callback<User>((r) => Users.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<User>())).Callback<User>((r) => Users.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Arrange
            UserDBRepository repo = new UserDBRepository(mockContext.Object);
            // Act
            var result = repo.Get(newUser.Id);

            // Assert
            Assert.Equal(result, newUser);
        }

        [Fact]
        public void GetNonExistantItem()
        {
            User newUser = new User() { Id = 3, Handle = "test", Type = "ADMIN" };
            //Setup
            var Users = new List<User>()
            {
                newUser
            };
            var data = Users.AsQueryable();
            var mockSet = setUpAsQueriable(data);
            mockSet.Setup(d => d.Add(It.IsAny<User>())).Callback<User>((r) => Users.Add(r));
            mockSet.Setup(d => d.Remove(It.IsAny<User>())).Callback<User>((r) => Users.Remove(r));

            var mockContext = new Mock<TweetContext>();
            mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            // Arrange
            UserDBRepository repo = new UserDBRepository(mockContext.Object);
            // Act
            var result = repo.Get(6);

            // Assert
            Assert.Null(result);
        }
    }
}