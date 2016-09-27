using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;

namespace TwitterWall
{
    public class Program
    {
        public static void Main(string[] args)
        {
            TwitterStream stream = TwitterStream.Instance();
            stream.Start();

            String portnum = Environment.GetEnvironmentVariable("PORT");
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>();

            if (portnum != null)
            {
                host.UseUrls("http://*:" + portnum + "/");
            }
            
            var builtHost = host.Build();

            builtHost.Run();
        }
    }
}
