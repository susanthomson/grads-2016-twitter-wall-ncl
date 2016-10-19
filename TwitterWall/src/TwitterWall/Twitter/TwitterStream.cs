using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweetinvi;
using TwitterWall.Controllers;
using TwitterWall.Hubs;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Utility;

namespace TwitterWall.Twitter
{
    class TwitterStream
    {
        private static TwitterStream _instance;
        public MediaDBRepository _mediaRepo = new MediaDBRepository();
        public TweetDBRepository _tweetRepo = new TweetDBRepository();
        public SubscriptionDBRepository _subRepo = new SubscriptionDBRepository();

        private const string CONSUMER_KEY = "CONSUMER_KEY";
        private const string CONSUMER_SECRET = "CONSUMER_SECRET";
        private const string ACCESS_TOKEN = "ACCESS_TOKEN";
        private const string ACCESS_TOKEN_SECRET = "ACCESS_TOKEN_SECRET";
        private const string CREDENTIALS_PROPERTY = "TwitterCredentials";

        public string ConsumerKey { get; set; }
        public string ConsumerSecret { get; set; }
        public string AccessToken { get; set; }
        public string AccessTokenSecret { get; set; }
        public List<UserCredential> Users = new List<UserCredential>();

        Tweetinvi.Streaming.IFilteredStream stream;

        protected TwitterStream()
        {
            SetCredentials();
            stream = Stream.CreateFilteredStream();
        }

        public void ConfigureStream()
        {
            stream.ClearFollows();
            stream.ClearTracks();

            stream.AddFollow(Common.BRISTECH);

            foreach(Subscription s in _subRepo.GetAll())
            {
                if (s.Type == Common.SubType.TRACK.ToString())
                {
                    stream.AddTrack(s.Value);
                }
                else if( s.Type == Common.SubType.PERSON.ToString())
                {
                    long userId;
                    bool validId = Int64.TryParse(s.Value, out userId);
                    if (validId) {
                        stream.AddFollow(userId);
                    }
                }
            }

            stream.MatchingTweetReceived += (sender, args) =>
            {
                Models.Tweet newTweet = new Models.Tweet(args.Tweet.Id, args.Tweet.FullText, args.Tweet.CreatedBy.ScreenName, args.Tweet.CreatedAt, args.Tweet.CreatedBy.Name, args.Tweet.CreatedBy.ProfileImageUrlFullSize);
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

        public void AddUserCredentials(UserCredential user)
        {
            UserCredential uc;
            if ((uc = Users.Find(u => u.Handle == user.Handle)) == null)
            {
                Users.Add(user);
            }
            else
            {
                Users.Remove(uc);
                Users.Add(user);
            }

        }

        public bool ChangeUserCredentials(string handle, string hash)
        {
            UserCredential uc;
            if ((uc = Users.Find(u =>u.Handle == handle)) != null && uc.VerifyHash(hash))
            {
                AccessToken = uc.GetAccessToken();
                AccessTokenSecret = uc.GetAccessSecret();
                Auth.SetUserCredentials(ConsumerKey, ConsumerSecret, AccessToken, AccessTokenSecret);
                return true;
            }
            return false;
        }

        private void SetCredentials()
        {
            ConsumerKey = Environment.GetEnvironmentVariable(CONSUMER_KEY);
            ConsumerSecret = Environment.GetEnvironmentVariable(CONSUMER_SECRET);
            AccessToken = Environment.GetEnvironmentVariable(ACCESS_TOKEN);
            AccessTokenSecret = Environment.GetEnvironmentVariable(ACCESS_TOKEN_SECRET);

            if (String.IsNullOrEmpty(ConsumerKey) || String.IsNullOrEmpty(ConsumerSecret) || String.IsNullOrEmpty(AccessToken) || String.IsNullOrEmpty(AccessTokenSecret))
            {
                dynamic result = JObject.Parse(JsonParser.GetConfig()[CREDENTIALS_PROPERTY].ToString());
                ConsumerKey = result[CONSUMER_KEY];
                ConsumerSecret = result[CONSUMER_SECRET];
                AccessToken = result[ACCESS_TOKEN];
                AccessTokenSecret = result[ACCESS_TOKEN_SECRET];
            }

            Auth.SetUserCredentials(ConsumerKey, ConsumerSecret, AccessToken, AccessTokenSecret);
        }

        public void Start()
        {
            stream.StartStreamMatchingAnyConditionAsync();
        }

        public void Stop()
        {
            stream.StopStream();
        }

        public void Restart()
        {
            Stop();
            ConfigureStream();
            Start();
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

        public void AddTrack(String keyword)
        {
            _subRepo.Add(new Subscription(keyword, Common.SubType.TRACK.ToString()));
        }

        public void AddPriorityUser(string userId)
        {
            _subRepo.Add(new Subscription(userId, Common.SubType.PERSON.ToString()));
        }

        public List<Subscription> GetTracks()
        {
            return _subRepo.GetAll(Common.SubType.TRACK).ToList();
        }

        public List<Subscription> GetPriorityUsers()
        {
            return _subRepo.GetAll(Common.SubType.PERSON).ToList();
        }

        public void RemoveSubscription(int id)
        {
            _subRepo.Remove(id);
        }


    }
}
