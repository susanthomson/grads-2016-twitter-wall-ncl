var twitter = $.connection.twitterHub;
var tweets = [];
twitter.client.receiveTweet = function (tweet) {
    tweets.push(tweet);
    $("#tweets").append('<li><strong>@' + tweet.Handle + '</strong>: ' + tweet.Body + " at "+tweet.Date);
};

$.get(window.location.href + "api/tweets", function (data) {
    if (data) {
        tweets = data;
    }
});

$.connection.hub.start().done(function () {
    $("#content").show();
    $("#loading").hide();
});