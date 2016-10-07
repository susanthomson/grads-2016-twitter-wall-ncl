import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Tweet } from "./tweet";
declare var $: any;

@Injectable()
export class TweetStream {
    private conn: any;
    private tweetsChanged = new Subject<Tweet[]>();
    tweets: Tweet[] = [];
    public changeTweets$ = this.tweetsChanged.asObservable();

    constructor() {
        this.conn = $.connection.twitterHub;
        this.streamTweets();
    }

    getTweets(): Array<Tweet> {
        return this.tweets;
    }

    streamTweets() {
        this.conn.client.receiveTweet = (tweet) => {
            this.tweets.push(tweet);
            this.tweetsChanged.next(this.tweets);
        };
        $.connection.hub.start().done(() => {
        });
    }
}
