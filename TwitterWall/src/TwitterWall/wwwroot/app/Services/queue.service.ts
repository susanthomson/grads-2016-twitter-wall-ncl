import { Injectable } from "@angular/core";
import { Queue } from "../Models/queue";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "./tweetstream.service";
import { Inject } from "@angular/core";

@Injectable()
export class QueueService {

    queue: Queue;
    subscription: any;

    constructor(@Inject(TweetStream) private tweetStream: TweetStream) {
        this.queue = new Queue(0);
        this.getTweetStream();
    }

    private getTweetStream() {
        this.subscription = this.tweetStream.changeTweets$.subscribe(
            tweets => {
                tweets.forEach(elem => {
                    this.queue.push(elem);
                });
            }
        );
    }

    public getQueue() {
        return this.queue;
    }

    public getSingleTweet() {
        return this.queue.pop();
    }

    public getInitialTweets(): Promise<any[]> {
        return this.tweetStream.getAllTweets();
    }
}
