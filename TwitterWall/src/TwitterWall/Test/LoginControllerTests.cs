using Moq;
using System;
using System.Collections.Generic;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Utility;
using Xunit;
using TwitterWall.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace TwitterWall.Test
{
    public class LoginControllerTests
    {
        [Fact]
        public void LoginRequestRespondsWithRedirectUrl()
        {
            var users = new List<User>()
            {
                new User() { Id = 1, Handle = "Bob", UserId = 03402342, Type = "ADMIN"}
            };
            MockMessageHandler handler = new MockMessageHandler(HttpStatusCode.OK, "oauth_token=TOKEN&oauth_token_secret=SECRET&oauth_callback_confirmed=true");
            Mock<UserDBRepository> repo = new Mock<UserDBRepository>();

            repo.Setup(r => r.Find(It.IsAny<Func<User, bool>>())).Returns(users);

            LoginController lc = new LoginController(repo.Object);
            lc._handler = handler;

            ContentResult result = lc.Get() as ContentResult;

            Assert.NotNull(result);
            Assert.Contains("oauth_token", result.Content);
        }

        [Fact]
        public void LoginRequestRespondsWithEmptyStringOnError()
        {
            var users = new List<User>()
            {
                new User() { Id = 1, Handle = "bob", UserId = 03402342, Type = "ADMIN"}
            };
            MockMessageHandler handler = new MockMessageHandler(HttpStatusCode.BadRequest, "");
            Mock<UserDBRepository> repo = new Mock<UserDBRepository>();

            repo.Setup(r => r.Find(It.IsAny<Func<User, bool>>())).Returns(users);

            LoginController lc = new LoginController(repo.Object);
            lc._handler = handler;

            StatusCodeResult result = lc.Get() as StatusCodeResult;

            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public void CallbackReturnsJavascriptToSaveTokenOnSuccess()
        {
            var users = new List<User>()
            {
                new User() { Id = 1, Handle = "Bob", UserId = 03402342, Type = "ADMIN"}
            };
            MockMessageHandler handler = new MockMessageHandler(HttpStatusCode.OK, "oauth_token=TOKEN&oauth_token_secret=SECRET&field=thisvalue&screenname=bob&oauth_callback_confirmed=true");
            Mock<UserDBRepository> repo = new Mock<UserDBRepository>();

            repo.Setup(r => r.Find(It.IsAny<Func<User, bool>>())).Returns(users);

            LoginController lc = new LoginController(repo.Object);
            lc._handler = handler;
            ContentResult content = lc.Get(1, "oauth", "oauth1") as ContentResult;

            Assert.NotNull(content);
            Assert.Contains("window.session", content.Content);
        }

        [Fact]
        public void CallbackReturnsJavascriptToRedirectOnlyOnFailure()
        {
            var users = new List<User>()
            {
                new User() { Id = 1, Handle = "Bob", UserId = 03402342, Type = "ADMIN"}
            };
            MockMessageHandler handler = new MockMessageHandler(HttpStatusCode.Forbidden, "");
            Mock<UserDBRepository> repo = new Mock<UserDBRepository>();

            repo.Setup(r => r.Find(It.IsAny<Func<User, bool>>())).Returns(users);

            LoginController lc = new LoginController(repo.Object);
            lc._handler = handler;
            ContentResult content = lc.Get(1, "oauth", "oauth1") as ContentResult;

            Assert.NotNull(content);
            Assert.DoesNotContain("window.session", content.Content);
        }

        [Fact]
        public void CallbackReturnsJavascriptToRedirectOnlyWhenWrongUser()
        {
            var users = new List<User>()
            {
                new User() { Id = 1, Handle = "Bob", UserId = 03402342, Type = "ADMIN"}
            };
            MockMessageHandler handler = new MockMessageHandler(HttpStatusCode.OK, "oauth_token=TOKEN&oauth_token_secret=SECRET&field=thisvalue&screenname=notbob&oauth_callback_confirmed=true");
            Mock<UserDBRepository> repo = new Mock<UserDBRepository>();

            repo.Setup(r => r.Find(It.IsAny<Func<User, bool>>())).Returns(new List<User>());

            LoginController lc = new LoginController(repo.Object);
            lc._handler = handler;
            ContentResult content = lc.Get(1, "oauth", "oauth1") as ContentResult;

            Assert.NotNull(content);
            Assert.DoesNotContain("window.session", content.Content);
        }
    }
}
