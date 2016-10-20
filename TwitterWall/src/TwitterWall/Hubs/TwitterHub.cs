using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Twitter;

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

        public void RemoveTrack(int id)
        {
            stream.RemoveTrack(id);
            GetTracks();
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
    }
}
