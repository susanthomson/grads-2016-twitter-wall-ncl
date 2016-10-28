import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from "@angular/core";
import { Tweet } from "../Models/tweet";

@Component({
    selector: "[tweet-display]",
    template: `
        <div id="tweet-display-group">
            <div>
                <img class="profile-image" src="{{tweet.ProfileImage}}"/>
                <div class="names-container">
                    <h2 id="name">{{tweet.Name}}</h2>
                    <img id="twitter-logo" src="../../img/Twitter_Social_Icon_Blue.png">
                    <h3 id="username">@{{tweet.Handle}}</h3>
                </div>
            </div>
            <div id="tweet-body" #tweetbody></div>
            <div class="attached-images">
                <img *ngFor="let img of tweet.MediaList; let i=index" src="{{img.Url}}"/>
            </div>
            <span id="timestamp">{{time}}</span>
        </div>
    `
})
export class TweetDisplay implements OnChanges {
    @Input() tweet: Tweet;
    tweetbody = "Error";
    time = "Error";
    @ViewChild("tweetbody") tweetbodyelem: ElementRef;

    ngOnChanges(changes) {
        this.tweet.Body = this.tweet.Body.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, "<span class='url'>$&</span>");
        this.tweet.Body = this.tweet.Body.replace(/(@\S+)/g, "<span class='mention'>$&</span>");
        this.tweet.Body = this.tweet.Body.replace(/(#\S+)/g, "<span class='hashtag'>$&</span>");
        this.tweetbodyelem.nativeElement.innerHTML = this.tweet.Body;

        this.tweet.Date = new Date(this.tweet.Date.toString());
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
