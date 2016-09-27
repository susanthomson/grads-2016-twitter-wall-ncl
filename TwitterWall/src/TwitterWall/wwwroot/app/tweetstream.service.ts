import { Injectable } from "@angular/core";
declare var $: any;

@Injectable()
export class TweetStream {
    private connection: any;
    private tweets: Array<Tweet>;

    constructor() {
        this.connection = $.connection.twitterHub;
        this.connection.hub.start().done(() => {
            this.streamTweets();
        });
    }

    getTweets(): Array<Tweet> {
        return this.tweets;
    }

    streamTweets() {
        this.connection.client.receiveTweet = (tweet) => {
            this.tweets.push(tweet);
        };
    }
}