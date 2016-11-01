using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Tweetinvi;
using TwitterWall.Controllers;
using TwitterWall.Hubs;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Utility;

namespace TwitterWall.Twitter
{
    public class TwitterStream
    {
        public MediaDBRepository _mediaRepo = new MediaDBRepository();
        public TweetDBRepository _tweetRepo = new TweetDBRepository();
        public SubscriptionDBRepository _subRepo = new SubscriptionDBRepository();
        public UserDBRepository _userRepo = new UserDBRepository();

        public string ConsumerKey { get; set; }
        public string ConsumerSecret { get; set; }
        public string AccessToken { get; set; }
        public string AccessTokenSecret { get; set; }

        Event streamEvent;

        private List<Models.Tweet> displayedTweets = new List<Models.Tweet>();
        private int tweetsLimit = 15;

        private Timer updateTimer;
        private const int UPDATE_INTERVAL = 15000;

        Tweetinvi.Streaming.IFilteredStream stream;

        public TwitterStream(Event ev, string ConsumerKey, string ConsumerSecret, string AccessToken, string AccessTokenSecret)
        {
            this.streamEvent = ev;
            this.ConsumerKey = ConsumerKey;
            this.ConsumerSecret = ConsumerSecret;
            this.AccessToken = AccessToken;
            this.AccessTokenSecret = AccessTokenSecret;
            UpdateCredentials();
            stream = Stream.CreateFilteredStream();

            this.displayedTweets =_tweetRepo.GetLatest(tweetsLimit, streamEvent.Name).ToList();

            updateTimer = new Timer(new TimerCallback(MaintainTweets), null, 0, UPDATE_INTERVAL);
        }

        private void MaintainTweets(object obj)
        {
            // Get the last tweet from DB
            Models.Tweet newTweet = _tweetRepo.GetLastTweet();
            if (newTweet == null)
            {
                return;
            }       
            if (displayedTweets.Exists(t => t.Id == newTweet.Id))
            {
                return;
            }
            
            if (this.displayedTweets.Count < this.tweetsLimit)
            {
                displayedTweets.Add(newTweet);
                BroadcastTweet(newTweet, Common.TweetAction.ADD);
            }
            else
            {
                // Find first non sticky tweet and replace it
                for (int i = 0; i < this.displayedTweets.Count; i++)
                {
                    if (this.displayedTweets[i].StickyList.Count == 0)
                    {
                        Models.Tweet oldTweet = displayedTweets[i];
                        this.displayedTweets.RemoveAt(i);
                        this.displayedTweets.Add(newTweet);
                        BroadcastTweet(newTweet, Common.TweetAction.ADD);
                        BroadcastTweet(oldTweet, Common.TweetAction.REMOVE);
                        break;
                    }
                }
            }
        }

        private void BroadcastTweet(Models.Tweet tweet, Common.TweetAction action)
        {
            // Invoke receiveTweet method on client side
            if (TweetsController._connectionManager != null)
            {
                TweetsController._connectionManager.GetHubContext<TwitterHub>().Clients.Group(streamEvent.Name).receiveTweet(tweet, action.ToString());
            }
        }

        public void ConfigureStream()
        {
            stream.ClearFollows();
            stream.ClearTracks();

            foreach (Subscription s in _subRepo.Find(s => s.Event.Id == streamEvent.Id))
            {
                if (s.Type == Common.SubType.TRACK.ToString())
                {
                    stream.AddTrack(s.Value);
                }
                else if(s.Type == Common.SubType.PERSON.ToString())
                {
                     stream.AddFollow(s.TwitterId);
                }
            }

            stream.MatchingTweetReceived += (sender, args) =>
            {
                Models.User isBannedUser = _userRepo.Find(b => (b.UserId == args.Tweet.CreatedBy.Id) && b.Type == Common.BanType).SingleOrDefault();
                if (isBannedUser != null)
                {
                    return;
                }

                Models.Tweet newTweet = new Models.Tweet(args.Tweet.Id, args.Tweet.FullText, args.Tweet.CreatedBy.ScreenName, args.Tweet.CreatedAt.ToUniversalTime(), args.Tweet.CreatedBy.Name, args.Tweet.CreatedBy.ProfileImageUrlFullSize, streamEvent, args.Tweet.CreatedBy.Id);
                TwitterWall.Models.Tweet result = _tweetRepo.Find(obj => obj.TweetId == newTweet.TweetId && obj.Event.Id == streamEvent.Id).SingleOrDefault();

                if (result != null)
                {
                    return;
                }

                _tweetRepo.Add(newTweet);
                _mediaRepo.AddFromTweet(args.Tweet, streamEvent);
            };

            stream.StreamStopped += (sender, args) =>
            {
                var exceptionThatCausedTheStreamToStop = args.Exception;
                var twitterDisconnectMessage = args.DisconnectMessage;
                if (TweetsController._connectionManager != null)
                {
                    TweetsController._connectionManager.GetHubContext<TwitterHub>().Clients.All.streamStatusChanged("Stopped: " + args.Exception + ". " + args.DisconnectMessage);
                }
            };
        }

        public List<Models.Tweet> GetDisplayTweets()
        {
            return this.displayedTweets;
        }

        public void UpdateCredentials()
        {
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
            if (stream.StreamState == Tweetinvi.Models.StreamState.Running)
            {
                Stop();
            }
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

        public void AddTrack(String keyword)
        {
            var track = _subRepo.Find(t => (t.Value == keyword) && (t.Type == Common.SubType.TRACK.ToString()) && (t.Event.Id == streamEvent.Id)).SingleOrDefault();
            if (track == null)
            {
                _subRepo.Add(new Subscription(keyword, Common.SubType.TRACK.ToString(), streamEvent));
            }
        }

        public void RemoveTweetsByHandle(string handle)
        {
            for (int i = 0; i < displayedTweets.Count; i++)
            {
                if (displayedTweets[i].Handle == handle)
                {
                    displayedTweets.RemoveAt(i);
                }
            }
        }

        public Boolean AddPriorityUser(string handle)
        {
            var user = Tweetinvi.User.GetUserFromScreenName(handle);
            if (user != null)
            {
                var userExist = _subRepo.Find(t => (t.Value == handle) && (t.Type == Common.SubType.PERSON.ToString()) && (t.Event.Id == streamEvent.Id)).SingleOrDefault();
                if (userExist == null)
                {
                    _subRepo.Add(new Subscription(handle, user.Id, Common.SubType.PERSON.ToString(), this.streamEvent));  
                }
                return true;
            }
            return false;
        }

        public List<Subscription> GetTracks()
        {
            return _subRepo.Find(s => s.Event.Id == streamEvent.Id && s.Type == Common.SubType.TRACK.ToString()).ToList();
        }

        public void RemoveTrack(int id)
        {
            _subRepo.Remove(id);
        }

        public List<Subscription> GetPriorityUsers()
        {
            return _subRepo.Find(s => s.Type == Common.SubType.PERSON.ToString() && s.Event.Id == this.streamEvent.Id).ToList();
        }

        public List<Models.User> GetBannedUsers()
        {
            return _userRepo.Find(u => u.Type == Common.BanType && u.Event.Id == this.streamEvent.Id).ToList();
        }

        public void RemoveSubscription(int id)
        {
            _subRepo.Remove(id);
        }

        public Event GetStreamEvent()
        {
            return this.streamEvent;
        }

        public void RemoveTweet(long tweetId)
        {
            for (int i = 0; i < displayedTweets.Count; i++)
            {
                if (displayedTweets[i].Id == tweetId)
                {
                    displayedTweets.RemoveAt(i);
                    break;
                }
            }
        }

        public void UpdateTweet(long tweetId)
        {
            for (int i = 0; i < displayedTweets.Count; i++)
            {
                if (displayedTweets[i].Id == tweetId)
                {
                    displayedTweets[i] = _tweetRepo.Find(t => t.Id == tweetId && t.Event.Id == streamEvent.Id).SingleOrDefault();
                    break;
                }
            }
        }
    }
}
