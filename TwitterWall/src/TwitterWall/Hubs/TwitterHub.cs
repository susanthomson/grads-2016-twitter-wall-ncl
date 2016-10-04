using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwitterWall.Models;
using TwitterWall.Repository;

namespace TwitterWall.Hubs
{
    public class TwitterHub : Hub
    {
        StickyDBRepository _stickyRepo = new StickyDBRepository();

        public void AddStickyTweet(long id)
        {
            _stickyRepo.Add(id);
        }

        public void RemoveStickyTweet(long id)
        {
            _stickyRepo.RemoveByTweetId(id);
        }
    }
}
