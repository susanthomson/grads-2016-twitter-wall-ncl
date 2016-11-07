using System;
using TwitterWall.Twitter;
using Xunit;
using static TwitterWall.Twitter.TwitterAuth;

namespace TwitterWall.Test
{
    public class TwitterAuthTest
    {
        [Fact]
        public void CheckNonceDifferentEachIteration()
        {
            Random rand = new Random();
            TwitterAuth auth = new TwitterAuthBuilder(rand)
                                .SetConsumerKeys("test", "test2")
                                .SetSignatureMethod("HMAC-SHA1")
                                .SetUrl("http://hdfiusdnf")
                                .SetVersion("1.0")
                                .BuildAndSign();

            TwitterAuth auth2 = new TwitterAuthBuilder(rand)
                                .SetConsumerKeys("test", "test2")
                                .SetSignatureMethod("HMAC-SHA1")
                                .SetUrl("http://hdfiusdnf")
                                .SetVersion("1.0")
                                .BuildAndSign();

            Assert.NotEqual(auth.Nonce, auth2.Nonce);
        }

        [Fact]
        public void CheckSignatureDifferentEachIteration()
        {
            Random rand = new Random();
            TwitterAuth auth = new TwitterAuthBuilder(rand)
                                .SetConsumerKeys("test", "test2")
                                .SetSignatureMethod("HMAC-SHA1")
                                .SetUrl("http://hdfiusdnf")
                                .SetVersion("1.0")
                                .BuildAndSign();

            TwitterAuth auth2 = new TwitterAuthBuilder(rand)
                                .SetConsumerKeys("test", "test2")
                                .SetSignatureMethod("HMAC-SHA1")
                                .SetUrl("http://hdfiusdnf")
                                .SetVersion("1.0")
                                .BuildAndSign();

            Assert.NotEqual(auth.Signature, auth2.Signature);
        }
    }
}