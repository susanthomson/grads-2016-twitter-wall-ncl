import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from "@angular/core";
import { Tweet } from "../Models/tweet";

@Component({
    selector: "[tweet-display]",
    template: `
        <div id="tweet-display-group">
            <h2 id="name"><img id="twitter-logo" src="../../img/Twitter_Social_Icon_Blue.png">{{tweet.Name}}</h2>
            <h3 id="username">@{{tweet.Handle}} <small>{{time}}</small></h3>
            <img id="profile-image" width="150" height="150" src="{{tweet.ProfileImage}}"/>
            <div id="tweet-body" #tweetbody></div>
        </div>
    `
})
export class TweetDisplay implements OnChanges {
    @Input() tweet: Tweet;
    tweetbody = "Error";
    time = "Error";
    @ViewChild("tweetbody") tweetbodyelem: ElementRef;

    ngOnChanges(changes) {
        this.tweetbodyelem.nativeElement.innerHTML = this.tweet.Body.replace(/(#\S+)/g, "<span class='hashtag'>$1</span>");

        this.tweet.Date = new Date(this.tweet.Date);
        let offset = (new Date()).getTimezoneOffset() / 60;
        let timeDiff = Date.now() - (this.tweet.Date.getTime() + (offset * 1000 * 3600));
        let diffSeconds = Math.floor(timeDiff / 1000);
        let diffMinutes = Math.floor(timeDiff / (1000 * 60));
        let diffHours = Math.floor(timeDiff / (1000 * 3600));
        let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        if (diffDays > 0) {
            let plural = diffDays !== 1 ? "s" : "";
            this.time = diffDays + " day" + plural + " ago";
        }
        else if (diffHours > 0) {
            let plural = diffHours !== 1 ? "s" : "";
            this.time = diffHours + " hour" + plural + " ago";
        }
        else if (diffMinutes > 0) {
            let plural = diffMinutes !== 1 ? "s" : "";
            this.time = diffMinutes + " minute" + plural + " ago";
        }
        else {
            let plural = diffSeconds !== 1 ? "s" : "";
            this.time = diffSeconds + " second" + plural + " ago";
        }
    }
};
