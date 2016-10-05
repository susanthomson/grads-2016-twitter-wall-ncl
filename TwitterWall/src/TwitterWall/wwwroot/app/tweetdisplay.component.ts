import { Component, OnInit, ElementRef } from "@angular/core";
import { Tweet } from "./tweet";

@Component({
    selector: "[tweet-display]",
    template: `
        <div id="tweet-display-group">
            <img src="{{tweet.ProfileImage}}"/>
            <h3 id="username">{{tweet.Handle}}</h3>
            <h3 id="username">{{tweet.Name}}</h3>
            <p id="tweet-body">{{tweet.Body}}</p>
        </div>
    `
})
export class TweetDisplay {
    tweet: Tweet = new Tweet(1, 1,
         "Hello Twitter, I really love being at #bristech", "@Testuser", new Date(), "Test User",
         "http://pbs.twimg.com/profile_images/708631138407940096/M0Ucjylz.jpg");
};
