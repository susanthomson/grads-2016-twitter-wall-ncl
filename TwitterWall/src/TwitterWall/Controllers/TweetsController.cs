using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TwitterWall.Models;
using TwitterWall.Repository;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using TwitterWall.Twitter;

namespace TwitterWall.Controllers
{
    [Route("api/[controller]")]
    public class TweetsController : Controller
    {
        public static IConnectionManager _connectionManager { get; set; }

        private TweetDBRepository _tweetRepo;
        StreamManager streamManager = StreamManager.Instance();

        public TweetsController(IConnectionManager connectionManager, TweetDBRepository repo)
        {
            _connectionManager = connectionManager;
            _tweetRepo = repo;
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
