using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TwitterWall.Models
{
    public class User
    {
        public User()
        {
            
        }

        public User(long userId, string handle)
        {
            this.UserId = userId;
            this.Handle = handle;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public long UserId { get; set; }
        public string Handle { get; set; }
        public string Type { get; set; }
        public Event Event { get; set; }
    }
}
