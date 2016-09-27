using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace TwitterWall.Test
{
    public class TwitterStreamTest : IDisposable
    {
        TwitterStream stream;

        public TwitterStreamTest()
        {
            stream = TwitterStream.Instance();
        }

        public void Dispose()
        {
            stream = null;
        }

        [Fact]
        public void StreamStart()
        {
            stream.Start();
            System.Threading.Thread.Sleep(2000);
            Assert.True(stream.StreamStatus() == Tweetinvi.Models.StreamState.Running);
        }

        [Fact]
        public void StreamStop()
        {
            stream.Stop();
            Assert.True(stream.StreamStatus() == Tweetinvi.Models.StreamState.Stop);
        }

        [Fact]
        public void StreamFollowsPerson()
        {
            Assert.True(stream.GetStream().FollowingUserIds.Count > 0);
        }
    }
}
