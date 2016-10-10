import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Tweet } from "../Models/tweet";

import "rxjs/add/operator/toPromise";

declare var $: any;

@Injectable()
export class TweetStream {
    private conn: any;
    private tweetsChanged = new Subject<Tweet[]>();
    tweets: Tweet[] = [];
    public changeTweets$ = this.tweetsChanged.asObservable();

    constructor(private http: Http) {
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

    getAllTweets(): Promise<any[]> {
        return this.http.get("api/tweets").toPromise().then((res) => {
            return JSON.parse((res as any)._body);
        });
    }
}
