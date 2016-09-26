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

        public Tweet(long id, string body, string sender, DateTime date)
        {
            this.Id = id;
            this.Body = body;
            this.Sender = sender;
            this.Date = date;
        }

        public long Id { get; set; }
        public string Body { get; set; }
        public string Sender { get; set; }
        public DateTime Date { get; set; }
        
    }
}
