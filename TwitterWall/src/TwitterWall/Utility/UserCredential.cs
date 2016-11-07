using System;
using System.Security.Cryptography;
using System.Text;

namespace TwitterWall.Utility
{
    public class UserCredential
    {
        public string Handle { get; set; }
        private string AccessToken = "";
        private string AccessSecret = "";
        private string Nonce = "";
        private string Hash = "";
        private Random Rand;

        public UserCredential(string Handle, string AccessToken, string AccessSecret)
        {
            this.Handle = Handle;
            this.AccessToken = AccessToken;
            this.AccessSecret = AccessSecret;
            Rand = new Random();
            GenerateNonce();
        }

        public string GetAccessToken()
        {
            return AccessToken;
        }

        public string GetAccessSecret()
        {
            return AccessSecret;
        }

        public string GetHash()
        {
            return Hash;
        }

        public string GenerateHash()
        {
            HMACSHA1 hmac = new HMACSHA1();
            Hash = Convert.ToBase64String(hmac.ComputeHash(new ASCIIEncoding().GetBytes(Handle + AccessToken + AccessSecret + Nonce)));
            return Hash;
        }

        public bool VerifyHash(string hash)
        {
            return hash == this.Hash;
        }

        private void GenerateNonce()
        {
            string result = "";
            SHA1 sha1 = SHA1.Create();

            Random rand = new Random();

            while (result.Length < 32)
            {
                string[] generatedRandoms = new string[4];

                for (int i = 0; i < 4; i++)
                {
                    generatedRandoms[i] = rand.Next().ToString();
                }

                result += Convert.ToBase64String(sha1.ComputeHash(Encoding.ASCII.GetBytes(string.Join("", generatedRandoms)))).Replace("=", "").Replace("/", "").Replace("+", "");
            }

            Nonce = result.Substring(0, 32);
        }
    }
}