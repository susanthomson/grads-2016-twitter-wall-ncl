import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";

@Component({
    selector: "active-tweets",
    template: `
        <h4>Display tweets</h4>
        <ul>
            <li *ngFor="let tweet of activeTweets; let i=index">
                <input type="checkbox" checked="checked" [attr.checked]="tweet.StickyList.length > 0 ? true : null" (click)=sticky(i,$event)>
                '{{tweet.Body}}', by @{{tweet.Handle}} at {{tweet.Date}}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTweet(i)"></span>
            </li>
        </ul>
        `
})
export class ActiveTweets {
    activeTweets: Tweet[] = [];
    constructor(private tweetStream: TweetStream) {
        this.activeTweets = this.tweetStream.getActiveTweets();
        this.tweetStream.activeQueueEvent$.subscribe((tweets) => {
            this.activeTweets = tweets;
        });
    }

    removeTweet(index: number): void {
        this.tweetStream.removeActiveTweet(this.activeTweets[index]);
    }

    addTweet(tweet: Tweet): void {
        this.tweetStream.addActiveTweet(tweet);
    }

    sticky(index: number, event: any): void {
        if (event.target.checked) {
            this.tweetStream.addSticky(this.activeTweets[index].Id);
        }
        else {
            this.tweetStream.removeSticky(this.activeTweets[index].Id);
        }
    }
}
