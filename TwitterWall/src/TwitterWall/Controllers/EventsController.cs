using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using TwitterWall.Models;
using TwitterWall.Repository;

namespace TwitterWall.Controllers
{
    [Route("api/[controller]")]
    public class EventsController : Controller
    {
        private EventDBRepository _eventRepo;

        public EventsController(EventDBRepository repo)
        {
            _eventRepo = repo;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<Event> Get(string name)
        {
            if (!String.IsNullOrEmpty(name))
            {
                return _eventRepo.Find(e => e.Name == name);
            }
            return _eventRepo.GetAll();
        }
    }
}