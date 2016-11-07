using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace TwitterWall.Twitter
{
    public class TwitterAuth
    {
        public string AuthenticationHeader = "";
        public string Nonce = "";
        public string Signature = "";

        private TwitterAuth()
        {
        }

        public class TwitterAuthBuilder
        {
            private string oauth_consumer_key = "";
            private string oauth_signature_method = "";
            private string oauth_signature = "";
            private string oauth_timestamp = "";
            private string oauth_nonce = "";
            private string oauth_version = "";
            private string oauth_consumer_secret = "";
            private string oauth_token = "";
            private string url = "";

            private Random rand;

            public TwitterAuthBuilder(Random rand)
            {
                this.rand = rand;
            }

            public TwitterAuthBuilder SetConsumerKeys(string consumerKey, string consumerSecret)
            {
                this.oauth_consumer_key = consumerKey;
                this.oauth_consumer_secret = consumerSecret;
                return this;
            }

            public TwitterAuthBuilder SetSignatureMethod(string method)
            {
                this.oauth_signature_method = method;
                return this;
            }

            public TwitterAuthBuilder SetVersion(string version)
            {
                this.oauth_version = version;
                return this;
            }

            public TwitterAuthBuilder SetOauthToken(string token)
            {
                this.oauth_token = token;
                return this;
            }

            public TwitterAuthBuilder SetUrl(string url)
            {
                this.url = url;
                return this;
            }

            private string Sign()
            {
                TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
                oauth_timestamp = ((int)t.TotalSeconds).ToString();
                oauth_nonce = GenerateNonce("jnfksin");

                string baseString = GenerateBase();
                string signatureKey = string.Format("{0}&", oauth_consumer_secret);
                HMACSHA1 hmac = new HMACSHA1(Encoding.ASCII.GetBytes(signatureKey));
                oauth_signature = Convert.ToBase64String(hmac.ComputeHash(new ASCIIEncoding().GetBytes(baseString)));

                StringBuilder sb = new StringBuilder();
                sb.Append("OAuth oauth_consumer_key=\"" + Uri.EscapeDataString(oauth_consumer_key) + "\"");
                sb.Append(", oauth_nonce=\"" + Uri.EscapeDataString(oauth_nonce) + "\"");
                sb.Append(", oauth_signature=\"" + Uri.EscapeDataString(oauth_signature) + "\"");
                sb.Append(", oauth_signature_method=\"" + Uri.EscapeDataString(oauth_signature_method) + "\"");
                sb.Append(", oauth_timestamp=\"" + Uri.EscapeDataString(oauth_timestamp) + "\"");

                if (!String.IsNullOrEmpty(oauth_token))
                {
                    sb.Append(", oauth_token=\"" + Uri.EscapeDataString(oauth_token) + "\"");
                }

                sb.Append(", oauth_version=\"" + Uri.EscapeDataString(oauth_version) + "\"");
                return sb.ToString();
            }

            // Signature needs to be generated with all parameters in
            private string GenerateBase()
            {
                SortedDictionary<string, string> parameters = new SortedDictionary<string, string>
                {
                    {"oauth_consumer_key", oauth_consumer_key},
                    {"oauth_nonce", oauth_nonce},
                    {"oauth_signature_method", oauth_signature_method},
                    {"oauth_timestamp", oauth_timestamp},
                    {"oauth_version", oauth_version}
                };

                if (!String.IsNullOrEmpty(oauth_token))
                {
                    parameters.Add("oauth_token", oauth_token);
                }

                StringBuilder sb = new StringBuilder();
                sb.Append("POST" + "&" + Uri.EscapeDataString(url) + "&" + Uri.EscapeDataString(NormalizeParameters(parameters)));
                return sb.ToString();
            }

            private string NormalizeParameters(SortedDictionary<string, string> parameters)
            {
                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < parameters.Count; i++)
                {
                    if (i > 0)
                    {
                        sb.Append("&");
                    }

                    KeyValuePair<string, string> parameter = parameters.ElementAt(i);
                    sb.AppendFormat("{0}={1}", parameter.Key, parameter.Value);
                }

                return sb.ToString();
            }

            private string GenerateNonce(string extra)
            {
                string result = "";
                SHA1 sha1 = SHA1.Create();

                while (result.Length < 32)
                {
                    string[] generatedRandoms = new string[4];

                    for (int i = 0; i < 4; i++)
                    {
                        generatedRandoms[i] = rand.Next().ToString();
                    }

                    result += Convert.ToBase64String(sha1.ComputeHash(Encoding.ASCII.GetBytes(string.Join("", generatedRandoms) + "|" + extra))).Replace("=", "").Replace("/", "").Replace("+", "");
                }

                return result.Substring(0, 32);
            }

            public TwitterAuth BuildAndSign()
            {
                TwitterAuth t = new TwitterAuth();
                t.AuthenticationHeader = Sign();
                t.Nonce = oauth_nonce;
                t.Signature = oauth_signature;
                return t;
            }
        }
    }
}