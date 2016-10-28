import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";

@Component({
    selector: "buffer-tweets",
    template: `
        <h4>Tweet queue</h4>
        <ul>
            <li *ngFor="let tweet of bufferTweets; let i=index" (click)="changeApproval(i)" [ngClass]="{'approved': isTweetApproved(i)}">
                '{{tweet.Body}}', by @{{tweet.Handle}} at {{tweet.Date}}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTweet(i)"></span>
                <span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true" (click)="banUser(tweet)"></span>
            </li>
        </ul>
        `
})
export class BufferTweets {
    bufferTweets: Tweet[] = [];
    counter: number = 0;
    approvals: Object = {};

    constructor(private tweetStream: TweetStream) {
        this.bufferTweets = this.tweetStream.getQueue();
        this.tweetStream.queueEvent$.subscribe((tweets) => {
            this.bufferTweets = tweets;
        });
    }

    changeApproval(index: number): void {
        this.approvals[this.bufferTweets[index].TweetId] = !this.approvals[this.bufferTweets[index].TweetId];
    }

    isTweetApproved(index: number): boolean {
        return this.approvals[this.bufferTweets[index].TweetId];
    }

    popFirst(): Tweet {
        let tweet = this.bufferTweets.find((el, i) => {
            return this.approvals[this.bufferTweets[i].TweetId];
        });
        if (tweet) {
            let index = this.bufferTweets.indexOf(tweet);
            this.removeTweet(index);
            return tweet;
        }
        return null;
    }
 
    removeTweet(index: number): void {
        this.tweetStream.removeTweet(this.bufferTweets[index]);
    }

    banUser(tweet) {
        this.tweetStream.banUser(tweet);
    }
}
