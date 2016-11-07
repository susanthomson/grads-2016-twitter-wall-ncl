using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace TwitterWall.Utility
{
    public class MockMessageHandler : HttpMessageHandler
    {
        private HttpStatusCode code;
        private string content;

        public MockMessageHandler(HttpStatusCode code, string content)
        {
            this.code = code;
            this.content = content;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Task<HttpResponseMessage> t = Task.Run(() =>
            {
                HttpResponseMessage res = new HttpResponseMessage(code);
                res.Content = new StringContent(content);
                return res;
            });

            return t;
        }
    }
}