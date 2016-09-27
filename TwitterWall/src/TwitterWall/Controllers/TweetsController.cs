using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TwitterWall.Models;
using TwitterWall.Repository;
using Microsoft.AspNetCore.SignalR.Infrastructure;

namespace TwitterWall.Controllers
{
    [Route("api/[controller]")]
    public class TweetsController : Controller
    {
        public static IConnectionManager _connectionManager { get; set; }

        public TweetsController(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Tweet> Get()
        {
            return TwitterStream.Instance()._tweetRepo.GetAll();
        }
    }
}
