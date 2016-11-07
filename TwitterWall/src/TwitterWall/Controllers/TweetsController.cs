using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TwitterWall.Models;
using TwitterWall.Repository;
using TwitterWall.Twitter;

namespace TwitterWall.Controllers
{
    [Route("api/[controller]")]
    public class TweetsController : Controller
    {
        private TweetDBRepository _tweetRepo;
        private StreamManager streamManager;

        public TweetsController(TweetDBRepository repo, StreamManager manager)
        {
            _tweetRepo = repo;
            streamManager = manager;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Tweet> Get(string eventName)
        {
            if (!String.IsNullOrEmpty(eventName))
            {
                return streamManager.GetEventTweets(eventName);
            }
            else
            {
                return _tweetRepo.GetAll();
            }
        }
    }
}