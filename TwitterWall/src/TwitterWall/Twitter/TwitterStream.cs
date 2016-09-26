using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweetinvi;
using TwitterWall.Controllers;
using TwitterWall.Hubs;
using TwitterWall.Repository;
using TwitterWall.Utility;

namespace TwitterWall
{
    class TwitterStream
    {
        private static TwitterStream _instance;
        public TweetRepository _tweetRepo = new TweetRepository();
        private const string CONSUMER_KEY = "CONSUMER_KEY";
        private const string CONSUMER_SECRET = "CONSUMER_SECRET";
        private const string ACCESS_TOKEN = "ACCESS_TOKEN";
        private const string ACCESS_TOKEN_SECRET = "ACCESS_TOKEN_SECRET";


        Tweetinvi.Streaming.IFilteredStream stream;

        protected TwitterStream()
        {
            SetCredentials();       
            stream = Stream.CreateFilteredStream();
            // STREAM CONFIGURATION

            //stream.AddTrack("Justas");
            stream.AddFollow(776716619720585216);

            stream.MatchingTweetReceived += (sender, args) =>
            {
                System.Diagnostics.Debug.WriteLine(args.Tweet);
                _tweetRepo.Add(new Models.Tweet(args.Tweet.CreatedBy.Id, args.Tweet.Text, args.Tweet.CreatedBy.ScreenName, args.Tweet.CreatedAt.Date));

                ValuesController._connectionManager.GetHubContext<TwitterHub>().Clients.All.receiveTweet(new Models.Tweet(args.Tweet.CreatedBy.Id, args.Tweet.Text, args.Tweet.CreatedBy.ScreenName, args.Tweet.CreatedAt.Date));
            };
            // END OF STREAM CONFIGURATION
        }

        private void SetCredentials()
        {            
            string consumer_key = Environment.GetEnvironmentVariable(CONSUMER_KEY);
            string consumer_secret = Environment.GetEnvironmentVariable(CONSUMER_SECRET);
            string access_token = Environment.GetEnvironmentVariable(ACCESS_TOKEN);
            string access_token_secret = Environment.GetEnvironmentVariable(ACCESS_TOKEN_SECRET);

            if (String.IsNullOrEmpty(consumer_key) || String.IsNullOrEmpty(consumer_secret) || String.IsNullOrEmpty(access_token) || String.IsNullOrEmpty(access_token_secret))
            {
                // Read from JSON config
                JObject result = JsonParser.ReadJsonFile(@".\Twitter\StreamConfig.json");
                System.Diagnostics.Debug.WriteLine(result[CONSUMER_KEY].ToString());
                System.Diagnostics.Debug.WriteLine(result[CONSUMER_SECRET].ToString());
                System.Diagnostics.Debug.WriteLine(result[ACCESS_TOKEN].ToString());
                System.Diagnostics.Debug.WriteLine(result[ACCESS_TOKEN_SECRET].ToString());

                Auth.SetUserCredentials(result[CONSUMER_KEY].ToString(), result[CONSUMER_SECRET].ToString(), result[ACCESS_TOKEN].ToString(), result[ACCESS_TOKEN_SECRET].ToString());
            }
            else
            {
                Auth.SetUserCredentials(consumer_key, consumer_secret, access_token, access_token_secret);
            }
            
        }

        public void Start()
        {
            stream.StartStreamMatchingAllConditionsAsync();
        }

        public void Stop()
        {
            stream.StopStream();
        }

        public static TwitterStream Instance()
        {
            if (_instance == null)
            {
                _instance = new TwitterStream();
            }
            return _instance;
        }
    }
}
