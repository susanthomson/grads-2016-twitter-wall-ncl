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
        public MediaDBRepository _mediaRepo = new MediaDBRepository();
        public TweetDBRepository _tweetRepo = new TweetDBRepository();
        private const string CONSUMER_KEY = "CONSUMER_KEY";
        private const string CONSUMER_SECRET = "CONSUMER_SECRET";
        private const string ACCESS_TOKEN = "ACCESS_TOKEN";
        private const string ACCESS_TOKEN_SECRET = "ACCESS_TOKEN_SECRET";


        Tweetinvi.Streaming.IFilteredStream stream;

        protected TwitterStream()
        {
            SetCredentials();       
            stream = Stream.CreateFilteredStream();
            ConfigureStream();
        }

        private void ConfigureStream()
        {
            stream.AddFollow(Users.BRISTECH);
            stream.MatchingTweetReceived += (sender, args) =>
            {
                Models.Tweet newTweet = new Models.Tweet(args.Tweet.Id, args.Tweet.Text, args.Tweet.CreatedBy.ScreenName, args.Tweet.CreatedAt, args.Tweet.CreatedBy.Name, args.Tweet.CreatedBy.ProfileImageUrlFullSize);
                TwitterWall.Models.Tweet result = _tweetRepo.Find(obj => obj.TweetId == newTweet.TweetId).SingleOrDefault();
                if (result == null)
                {
                    _tweetRepo.Add(newTweet);
                    _mediaRepo.AddFromTweet(args.Tweet);                   

                    // Invoke receiveTweet method on client side
                    if (TweetsController._connectionManager != null)
                    {
                        TweetsController._connectionManager.GetHubContext<TwitterHub>().Clients.All.receiveTweet(_tweetRepo.Find(t => t.TweetId == newTweet.TweetId).SingleOrDefault());
                    }
                }
            };
        }

        private void SetCredentials()
        {            
            string consumer_key = Environment.GetEnvironmentVariable(CONSUMER_KEY);
            string consumer_secret = Environment.GetEnvironmentVariable(CONSUMER_SECRET);
            string access_token = Environment.GetEnvironmentVariable(ACCESS_TOKEN);
            string access_token_secret = Environment.GetEnvironmentVariable(ACCESS_TOKEN_SECRET);

            if (String.IsNullOrEmpty(consumer_key) || String.IsNullOrEmpty(consumer_secret) || String.IsNullOrEmpty(access_token) || String.IsNullOrEmpty(access_token_secret))
            {
                JObject result = JsonParser.ParseFromFile(@".\Twitter\StreamConfig.json");
                consumer_key = result[CONSUMER_KEY].ToString();
                consumer_secret = result[CONSUMER_SECRET].ToString();
                access_token = result[ACCESS_TOKEN].ToString();
                access_token_secret = result[ACCESS_TOKEN_SECRET].ToString();
            }

            Auth.SetUserCredentials(consumer_key, consumer_secret, access_token, access_token_secret);
        }

        public void Start()
        {
            stream.StartStreamMatchingAllConditionsAsync();
        }

        public void Stop()
        {
            stream.StopStream();
        }

        public Tweetinvi.Models.StreamState StreamStatus()
        {
            return stream.StreamState;
        }

        public Tweetinvi.Streaming.IFilteredStream GetStream()
        {
            return stream;
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
