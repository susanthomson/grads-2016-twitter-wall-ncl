﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TwitterWall.Models
{
    public class Subscription
    {
        public Subscription()
        {

        }

        public Subscription(string value, string type)
        {
            this.Value = value;
            this.Type = type;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Value { get; set; }
        [Required]
        public string Type { get; set; }
    }
}