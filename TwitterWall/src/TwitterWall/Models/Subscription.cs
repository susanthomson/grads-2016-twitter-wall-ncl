using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TwitterWall.Models
{
    public class Subscription
    {
        public Subscription()
        {
        }

        public Subscription(string value, string type, Event ev)
        {
            this.Value = value;
            this.Type = type;
            this.Event = ev;
        }

        public Subscription(string value, long twitterId, string type, Event ev)
        {
            this.Value = value;
            this.TwitterId = twitterId;
            this.Type = type;
            this.Event = ev;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Value { get; set; }

        public long TwitterId { get; set; }

        [Required]
        public string Type { get; set; }

        public Event Event { get; set; }
    }
}