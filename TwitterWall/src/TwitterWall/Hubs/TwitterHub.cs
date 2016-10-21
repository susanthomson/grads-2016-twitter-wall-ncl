using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Twitter;
using TwitterWall.Utility;

namespace TwitterWall.Hubs
{
    public class TwitterHub : Hub
    {
        StickyDBRepository _stickyRepo = new StickyDBRepository();
        TwitterStream stream = TwitterStream.Instance();

        public void AddStickyTweet(long tweetId)
        {
            _stickyRepo.Add(tweetId);
            TweetUpdate(stream._tweetRepo.Find(t => t.Id == tweetId).SingleOrDefault());
        }

        public void RemoveStickyTweet(long tweetId)
        {
            _stickyRepo.RemoveByTweetId(tweetId);
            TweetUpdate(stream._tweetRepo.Find(t => t.Id == tweetId).SingleOrDefault());
        }

        public void FollowTrack(string keyword)
        {
            stream.AddTrack(keyword);
            GetTracks();
        }

        public void FollowUser(string handle)
        {
            if (!stream.AddPriorityUser(handle))
            {
                Clients.Caller.invalidUser("That user does not exist!");
            }
            else
            {
                GetPriorityUsers();
            }
        }

        public void RemoveSubscription(int id, string type)
        {
            Subscription subscription = stream._subRepo.Find(sub => sub.Id == id).First();
            if (subscription != null)
            {
                stream.RemoveSubscription(id);
                if (subscription.Type == Common.SubType.TRACK.ToString())
                {
                    GetTracks();
                }
                else if (subscription.Type == Common.SubType.PERSON.ToString())
                {
                    GetPriorityUsers();
                }
            }

        }

        public void RemoveTweet(long id)
        {
            stream._tweetRepo.Remove(id);
            Clients.All.tweetRemoved(id);
        }

        public void GetTracks()
        {
            Clients.All.receiveTracks(stream.GetTracks());
        }

        public void GetPriorityUsers()
        {
            Clients.All.receiveUsers(stream.GetPriorityUsers());
        }

        public void GetBannedUsers()
        {
            Clients.All.receiveBannedUsers(stream.GetBannedUsers());
        }

        public void RestartStream()
        {
            stream.Restart();
        }

        public void RemoveTweetImage(long imageId)
        {
            MediaUrl media = stream._mediaRepo.Find(m => m.Id == imageId).SingleOrDefault();
            if (media != null)
            {
                stream._mediaRepo.Remove(imageId);
                Tweet tweet = stream._tweetRepo.Find(t => t.Id == media.Tweet.Id).SingleOrDefault();
                if (tweet != null)
                {
                    TweetUpdate(tweet);
                }
            }
        }

        public void TweetUpdate(Tweet tweet)
        {
            if (tweet != null)
            {
                Clients.All.tweetChanged(tweet);
            }
        }

        public void BanUser(Tweet tweet)
        {
            Tweet serverTweet = stream._tweetRepo.Get(tweet.Id);
            User alreadyBanned = stream._userRepo.Find(user => user.UserId == serverTweet.UserId).SingleOrDefault();
            if (alreadyBanned == null)
            {
                User newUser = new User(serverTweet.UserId, serverTweet.Handle);
                newUser.Type = Common.BanType;
                stream._userRepo.Add(newUser);
                Clients.All.userBanned(stream.GetBannedUsers());
            }
        }

        public void RemoveBannedUser(int bannedUserId)
        {
            User bannedUser = stream._userRepo.Get(bannedUserId);
            if (bannedUser != null)
            {
                stream._userRepo.Remove(bannedUserId);
                GetBannedUsers();
            }
        }
    }
}
