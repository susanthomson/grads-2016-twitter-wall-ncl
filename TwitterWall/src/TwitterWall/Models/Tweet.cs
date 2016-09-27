using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TwitterWall.Models
{
    public class Tweet
    {
        public Tweet ()
        {

        }

        public Tweet(long id, string body, string handle, DateTime date, string name, string profileImage)
        {
            this.Id = id;
            this.Body = body;
            this.Handle = handle;
            this.Date = date;
            this.Name = name;
            this.ProfileImage = profileImage;
        }

        public long Id { get; set; }
        public string Body { get; set; }
        public string Handle { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string ProfileImage { get; set; }
        public List<string> AttachedImages { get; set; }
        
    }
}
