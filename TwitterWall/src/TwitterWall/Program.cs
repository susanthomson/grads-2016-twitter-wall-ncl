using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using TwitterWall.Twitter;

namespace TwitterWall
{
    public class Program
    {
        public static void Main(string[] args)
        {
            String portnum = Environment.GetEnvironmentVariable("PORT") ?? "5000";
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://*:" + portnum + "/")
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>();
            
            var builtHost = host.Build();

            builtHost.Run();
        }
    }
}
