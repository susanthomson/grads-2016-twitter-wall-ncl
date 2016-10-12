import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Tweet } from "../Models/tweet";
import { Queue } from "../Models/queue";

import "rxjs/add/operator/toPromise";

declare var $: any;

@Injectable()
export class TweetStream {
    private conn: any;
    private tweetsQueue: Tweet[];
    private activeTweets: Tweet[];
    private queueChanged = new Subject<Tweet[]>();
    public queueEvent$ = this.queueChanged.asObservable();
    private activeQueueChanged = new Subject<Tweet[]>();
    public activeQueueEvent$ = this.activeQueueChanged.asObservable();
    activeQueueSize: number = 15;

    constructor(private http: Http) {
        this.tweetsQueue = [];
        this.activeTweets = [];
        this.conn = $.connection.twitterHub;
        this.conn.client.receiveTweet = (tweet) => {
            this.addTweet(tweet);
        };
        $.connection.hub.start().done(() => {});

        this.getAllTweets().then((tweets) => {
            this.activeTweets = tweets.slice(-this.activeQueueSize);
            this.activeQueueChanged.next(this.activeTweets);
        });

        setInterval(() => {
            if (this.activeTweets.length < this.activeQueueSize && this.tweetsQueue.length > 0) {
                this.addActiveTweet(this.popNextTweet());

            }
            else if (this.tweetsQueue.length > 0) {
                let tweet = this.activeTweets[Date.now() % this.activeQueueSize];
                this.removeActiveTweet(tweet);
                this.addActiveTweet(this.popNextTweet());
            }
        }, 10000);
    }

    getAllTweets(): Promise<any[]> {
        return this.http.get("api/tweets").toPromise().then((res) => {
            return JSON.parse((res as any)._body);
        });
    }

    getQueue(): Tweet[] {
        return this.tweetsQueue;
    }

    getActiveTweets(): Tweet[] {
        return this.activeTweets;
    }

    addActiveTweet(tweet: Tweet): boolean {
        if (tweet && this.activeTweets.length < this.activeQueueSize) {
            this.activeTweets.push(tweet);
            this.activeQueueChanged.next(this.activeTweets);
            return true;
        }

        return false;
    }

    removeActiveTweet(tweet: Tweet): boolean {
        let index = this.activeTweets.indexOf(tweet);
        if (index !== -1) {
            this.activeTweets.splice(index, 1);
            this.activeQueueChanged.next(this.activeTweets);
            return true;
        }

        return false;
    }

    popNextTweet(): Tweet {
        let tweet = this.tweetsQueue.shift();

        if (tweet) {
            this.queueChanged.next(this.tweetsQueue);
        }

        return tweet;
    }

    addTweet(tweet: Tweet): void {
        this.tweetsQueue.push(tweet);
        this.queueChanged.next(this.tweetsQueue);
    }

    removeTweet(tweet: Tweet): void {
        let index = this.tweetsQueue.indexOf(tweet);
        if (index !== -1) {
            this.tweetsQueue.splice(index, 1);
            this.queueChanged.next(this.tweetsQueue);
        }
    }
}
