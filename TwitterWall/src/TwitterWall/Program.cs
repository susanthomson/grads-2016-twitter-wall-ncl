using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;

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