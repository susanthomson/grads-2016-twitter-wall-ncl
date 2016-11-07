using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;

namespace TwitterWall.Utility
{
    public static class JsonParser
    {
        public static JObject ParseFromFile(string path)
        {
            using (StreamReader file = File.OpenText(path))
            using (JsonTextReader reader = new JsonTextReader(file))
            {
                JObject o2 = (JObject)JToken.ReadFrom(reader);
                return o2;
            }
        }

        public static JObject GetConfig()
        {
            return ParseFromFile(@".\Utility\Config.json");
        }
    }
}