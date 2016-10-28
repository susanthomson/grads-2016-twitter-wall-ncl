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

        public TweetsController(IConnectionManager connectionManager, TweetDBRepository repo)
        {
            _connectionManager = connectionManager;
            _tweetRepo = repo;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Tweet> Get(string latest, string eventName)
        {            
            if (!String.IsNullOrEmpty(latest) && !String.IsNullOrEmpty(eventName))
            {
                int limitNumber;
                bool result = Int32.TryParse(latest, out limitNumber);
                if (result && limitNumber >= 0)
                {
                    return _tweetRepo.GetLatest(limitNumber, eventName);
                }
                return null;
            }
            else
            {
                return _tweetRepo.GetAll();
            }
        }
    }
}
