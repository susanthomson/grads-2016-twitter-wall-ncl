using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Utility;
using Xunit;

namespace TwitterWall.Test
{
    public class UserCredentialTest
    {
        [Fact]
        public void ValidHashReturnsTrue()
        {
            UserCredential cred = new UserCredential("test", "token1", "token2");
            string hash = cred.GenerateHash();
            Assert.True(cred.VerifyHash(hash));
        }

        [Fact]
        public void InvalidHashReturnsFalse()
        {
            UserCredential cred = new UserCredential("test", "token1", "token2");
            string hash = cred.GenerateHash() + "errortest";
            Assert.False(cred.VerifyHash(hash));
        }

        [Fact]
        public void HashIsDifferentEachTimeGenerated()
        {
            UserCredential cred = new UserCredential("test", "token1", "token2");
            string hash = cred.GenerateHash();
            string hash2 = cred.GenerateHash();
            Assert.NotEqual(hash, hash2);
        }
    }
}
