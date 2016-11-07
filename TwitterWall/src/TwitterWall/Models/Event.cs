using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TwitterWall.Models
{
    public class Event
    {
        public Event()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<Tweet> Tweets { get; set; }

        [JsonIgnore]
        public ICollection<User> Users { get; set; }

        [JsonIgnore]
        public ICollection<Subscription> Subscriptions { get; set; }
    }
}