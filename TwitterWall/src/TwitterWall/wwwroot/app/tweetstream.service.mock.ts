import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Tweet } from "./tweet";

@Injectable()
export class TweetStreamMock {
    private tweetsChanged = new Subject<Tweet[]>();
    private tweets: Tweet[] = [];
    public changeTweets$ = this.tweetsChanged.asObservable();
    private tweet1: Tweet;
    private tweet2: Tweet;

    constructor() {
        this.tweet1 = new Tweet(1, 23232, "Hello World", "Jesus", new Date(), "Jesus Christ", "https://www.heaven.clouds");
        this.tweet2 = new Tweet(2, 343454, "Hello Mars", "Satan", new Date(), "Lucifer", "https://www.hell.underground");
        this.tweets.push(this.tweet1);
        this.tweets.push(this.tweet2);
    }

    pushTweets(): void {
        this.tweetsChanged.next(this.tweets);
    }
}