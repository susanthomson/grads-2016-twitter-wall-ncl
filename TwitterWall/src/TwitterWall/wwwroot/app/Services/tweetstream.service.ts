import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Tweet } from "../Models/tweet";
import { Queue } from "../Models/queue";

import "rxjs/add/operator/toPromise";

declare var $: any;

const DELETION_INTERVAL = 10000;

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

    private tracks = new Subject<any[]>();
    public tracksReceived$ = this.tracks.asObservable();

    private users = new Subject<any[]>();
    public usersReceived$ = this.users.asObservable();

    private init = new Subject<boolean>();
    public initialisationChanged$ = this.init.asObservable();
    private initialised: boolean = false;
    constructor(private http: Http) {
        this.tweetsQueue = [];
        this.activeTweets = [];
        this.conn = $.connection.twitterHub;
        this.conn.client.receiveTweet = (tweet) => {
            this.addTweet(tweet);
        };

        this.conn.client.receiveTracks = (tracks) => {
            this.tracks.next(tracks);
        };

        this.conn.client.receiveUsers = (users) => {
            this.users.next(users);
        };

        this.conn.client.stickyChanged = (newTweet: Tweet) => {
            this.activeTweets.some((tweet, i) => {
        this.conn.client.tweetChanged = (newTweet: Tweet) => {
            let success = this.activeTweets.some((tweet, i) => {
                if (tweet.Id === newTweet.Id) {
                    this.activeTweets[i] = newTweet;
                    return true;
                }
                return false;
            });
            if (success) {
                this.activeQueueChanged.next(this.activeTweets);
            }
        };

        this.conn.client.tweetRemoved = (id: number) => {
            let success = this.activeTweets.some((tweet, i) => {
                if (tweet.Id === id) {
                    this.activeTweets.splice(i, 1);
                    return true;
                }
                return false;
            });
            if (success) {
                this.activeQueueChanged.next(this.activeTweets);
            }
        };

        $.connection.hub.start().done(() => {
            this.init.next(true);
            this.initialised = true;
        });

        this.getLatestTweets().then((tweets) => {
            this.activeTweets = tweets.slice(-this.activeQueueSize);
            this.activeQueueChanged.next(this.activeTweets);
        });

        setInterval(() => {
            if (this.activeTweets.length < this.activeQueueSize && this.tweetsQueue.length > 0) {
                this.addActiveTweet(this.popNextTweet());

            }
            else if (this.tweetsQueue.length > 0) {
                this.activeTweets.some((tweet) => {
                    // If a tweet has been stickied, then the StickyList array length will be one element
                    if (tweet.StickyList.length === 0) {
                        this.removeActiveTweet(tweet);
                        this.addActiveTweet(this.popNextTweet());
                        return true;
                    }
                    return false;
                });
            }
        }, DELETION_INTERVAL);
    }

    getLatestTweets(): Promise<any[]> {
        return this.http.get("api/tweets?latest=" + this.activeQueueSize).toPromise().then((res) => {
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

    followTrack(keyword: string): void {
        if (keyword.length < 60) {
            this.conn.server.followTrack(keyword);
        }
    }

    getTracks(): void {
        this.conn.server.getTracks();
    }


   followUser(userId: string): void {
        this.conn.server.followUser(userId);
    }

    getUsers(): void {
        this.conn.server.getPriorityUsers();
    }

    removeSubscription(id: number, type: string): void {
        this.conn.server.removeSubscription(id, type);
    }

    restartStream(): void {
        this.conn.server.restartStream();
    }

    isInitialised(): boolean {
        return this.initialised;
    }

    addSticky(tweetId: number): void {
        this.conn.server.addStickyTweet(tweetId);
    }

    removeSticky(tweetId: number): void {
        this.conn.server.removeStickyTweet(tweetId);
    }

    removeTweetImage(tweetIndex: number, imageIndex: number, imageId: number): void {
        this.conn.server.removeTweetImage(imageId);
        this.activeTweets[tweetIndex].MediaList.splice(imageIndex, 1);
    }

    removeActiveTweetFromDB(tweet: Tweet): void {
        this.conn.server.removeTweet(tweet.Id);
    }
}
