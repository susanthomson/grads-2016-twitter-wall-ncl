import { Component, OnInit } from "@angular/core";
import { TweetStream } from "../Services/tweetstream.service";
import { Tweet } from "../Models/tweet";

@Component({
    selector: "twitter-card",
    template: `
    <h1>A twitter card.....</h1>
    <div class="row">
        <div *ngFor="let tweet of tweets" class="col-sm-6 col-md-4">
            <div class="thumbnail tweetcards">
            <img src="{{tweet.ProfileImage}}" alt="...">
            <div class="caption">
                <h3><a href="https://twitter.com/{{tweet.Handle}}">@{{tweet.Handle}}</a></h3>
                <p>{{tweet.Body}}</p>
                <p>{{tweet.Date | date:'medium' }}</p>
            </div>
            </div>
        </div>
    </div>
    `
})
export class TwitterCard implements OnInit {
    public tweets: Tweet[] = [];
    subscription: any;

    constructor(private tweetStream: TweetStream) {
    }

    ngOnInit(): void {
        this.subscription = this.tweetStream.changeTweets$.subscribe(
            tweets => {
                this.tweets = tweets;
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    removeTweet(id: number): Boolean {
       const index = this.tweets.findIndex(elem => elem.Id === id);
       if (index === -1) return false;
       this.tweets.splice(index, 1);
       return true;
    }

}
