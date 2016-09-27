var twitter = $.connection.twitterHub;
var tweets = [];
twitter.client.receiveTweet = function (tweet) {
    console.log(tweet);
    tweets.push(tweet);
    $("#tweets").append('<li><strong>@' + tweet.Handle + '</strong>: ' + tweet.Body + " at "+tweet.Date);
};

$.get(window.location.href + "api/tweets", function (data) {
    if (data) {
        console.log("Tweets: " + data);
        tweets = data;
    }
});

// Remove logging in production environment
$.connection.hub.logging = true;
$.connection.hub.start().done(function () {
    $("#content").show();
    $("#loading").hide();
});