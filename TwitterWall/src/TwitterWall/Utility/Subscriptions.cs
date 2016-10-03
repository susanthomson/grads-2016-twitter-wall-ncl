using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TwitterWall.Utility
{
    public static class Subscriptions
    {
        public enum Users
        {
            BRISTECH = 1600909274
        }

        public static long GetId(Users user)
        {
            return (long)user;
        }
    }
}
