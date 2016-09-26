using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace TwitterWall.Utility
{
    public static class JsonParser
    {
        public static JObject ReadJsonFile(string path)
        {
            JObject o1 = JObject.Parse(File.ReadAllText(path));

            // read JSON directly from a file
            using (StreamReader file = File.OpenText(path))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                JObject o2 = (JObject)JToken.ReadFrom(reader);
                return o2;
            }
        }
    }
}
