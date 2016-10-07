import { Component, OnInit, Input } from "@angular/core";
import { Tweet } from "./tweet";

@Component({
    selector: "[tweet-display]",
    template: `
        <div id="tweet-display-group">
            <img id="profile-image" width="200" height="200" src="{{tweet ? tweet.ProfileImage : test}}"/>
            <h3 id="username">{{tweet ? tweet.Handle : test}}</h3>
            <h3 id="name">{{tweet ? tweet.Name : test}}</h3>
            <p id="tweet-body">{{tweet ? tweet.Body : test}}</p>
        </div>
    `
})
export class TweetDisplay {
    @Input() tweet: Tweet;
};
