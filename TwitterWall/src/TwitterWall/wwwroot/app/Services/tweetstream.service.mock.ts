import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Tweet } from "../Models/tweet";
import { Queue } from "../Models/queue";

import "rxjs/add/operator/toPromise";

export enum Action {
    Add,
    Remove
};

@Injectable()
export class TweetStreamMock {
    private conn: any;
    private tweetsQueue: Tweet[];
    private activeTweets: Tweet[];
    private queueChanged = new Subject<Tweet[]>();
    public queueEvent$ = this.queueChanged.asObservable();
    private activeQueueChanged = new Subject<Tweet[]>();
    public activeQueueEvent$ = this.activeQueueChanged.asObservable();
    activeQueueSize: number = 5;

    constructor() {
        this.tweetsQueue = [];
        this.activeTweets = [];
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
