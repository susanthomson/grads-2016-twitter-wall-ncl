using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Twitter;
using TwitterWall.Utility;
using static TwitterWall.Twitter.TwitterAuth;

namespace TwitterWall.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private UserDBRepository _userRepo;
        public MockMessageHandler _handler;
        private const string API_REQUEST_TOKEN = "https://api.twitter.com/oauth/request_token";
        private const string API_ACCESS_TOKEN = "https://api.twitter.com/oauth/access_token";

        private StreamManager streamManager;

        private string CONSUMER_KEY;
        private string CONSUMER_SECRET;

        public LoginController(UserDBRepository repo, StreamManager manager)
        {
            _userRepo = repo;
            streamManager = manager;
            CONSUMER_KEY = manager.ConsumerKey;
            CONSUMER_SECRET = manager.ConsumerSecret;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            string responseString = await Login();

            if (String.IsNullOrEmpty(responseString))
            {
                return StatusCode(400);
            }

            // Dont need to strip off key as its used in the oauth/authorize request
            string oauthToken = responseString.Split('&')[0];
            string redirectString = "https://api.twitter.com/oauth/authorize?" + oauthToken;

            return Content(redirectString);
        }

        async private Task<String> Login()
        {
            using (HttpClient client = _handler == null ? new HttpClient() : new HttpClient(_handler))
            {
                Random rand = new Random();
                TwitterAuth auth = new TwitterAuthBuilder(rand)
                            .SetConsumerKeys(CONSUMER_KEY, CONSUMER_SECRET)
                            .SetSignatureMethod("HMAC-SHA1")
                            .SetVersion("1.0")
                            .SetUrl(API_REQUEST_TOKEN)
                            .BuildAndSign();

                string callback = Uri.EscapeUriString("/api/login/callback");
                StringContent content = new StringContent("{ \"oauth_callback\", \"" + callback + "\"}", Encoding.UTF8, "application/json");
                client.DefaultRequestHeaders.Add("Authorization", auth.AuthenticationHeader);

                HttpResponseMessage response = await client.PostAsync(API_REQUEST_TOKEN, content);

                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return "";
                }

                // Response looks like: oauth_token=TOKEN&oauth_token_secret=SECRET&oauth_callback_confirmed=true
                return await response.Content.ReadAsStringAsync();
            }
        }

        [Route("callback")]
        [HttpGet]
        public ActionResult Get(int id, [FromQuery]string oauth_token, [FromQuery]string oauth_verifier)
        {
            Task<UserCredential> task = GetUserTokens(oauth_token, oauth_verifier);
            task.Wait();
            if (task.Result != null)
            {
                return Content("<script language='javascript' type='text/javascript'>window.sessionStorage.setItem('token', '" + task.Result.GetHash() + "'); window.sessionStorage.setItem('handle', '" + task.Result.Handle + "'); window.location.href = '/#';</script>", "text/html");
            }
            else
            {
                return Content("<script language='javascript' type='text/javascript'>window.location.href = '/#';</script>", "text/html");
            }
        }

        async private Task<UserCredential> GetUserTokens(string oauth_token, string oauth_verifier)
        {
            using (HttpClient client = _handler == null ? new HttpClient() : new HttpClient(_handler))
            {
                Random rand = new Random();
                TwitterAuth auth = new TwitterAuthBuilder(rand)
                    .SetConsumerKeys(CONSUMER_KEY, CONSUMER_SECRET)
                    .SetSignatureMethod("HMAC-SHA1")
                    .SetUrl(API_ACCESS_TOKEN)
                    .SetVersion("1.0")
                    .SetOauthToken(oauth_token)
                    .BuildAndSign();

                List<KeyValuePair<string, string>> data = new List<KeyValuePair<string, string>>();
                data.Add(new KeyValuePair<string, string>("oauth_verifier", oauth_verifier));
                FormUrlEncodedContent content = new FormUrlEncodedContent(data);
                client.DefaultRequestHeaders.Add("oauth_verifier", oauth_verifier);
                client.DefaultRequestHeaders.Add("Authorization", auth.AuthenticationHeader);

                HttpResponseMessage response = await client.PostAsync(API_ACCESS_TOKEN, content);

                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return null;
                }

                string responseString = await response.Content.ReadAsStringAsync();

                string accessToken = responseString.Split('&')[0].Split('=')[1];
                string accessSecret = responseString.Split('&')[1].Split('=')[1];
                string screenName = responseString.Split('&')[3].Split('=')[1];

                User user = _userRepo.Find(u => u.Handle == screenName && u.Type == "ADMIN").SingleOrDefault();
                if (user != null)
                {
                    UserCredential uc = new UserCredential(screenName, accessToken, accessSecret);
                    uc.GenerateHash();
                    streamManager.AddUserCredentials(uc);
                    return uc;
                }

                return null;
            }
        }

        [Route("change")]
        [HttpPost]
        public bool Get([FromBody]LoginData data)
        {
            TwitterStream ts = streamManager.GetStream(data.Stream);
            if (ts != null)
            {
                bool res = streamManager.ChangeUserCredentials(data.Handle, data.Token, data.Stream);
                if (res)
                {
                    ts.Restart();
                    return true;
                }
            }
            return false;
        }
    }
}