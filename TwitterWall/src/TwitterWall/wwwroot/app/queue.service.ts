import { Injectable } from "@angular/core";
import { Queue } from "./queue";
import { Tweet } from "./tweet";
import { TweetStream } from "./tweetstream.service";

@Injectable()
export class QueueService {

    queue: Queue;
    subscription: any;

    constructor(private tweetStream, queueLimit: number) {
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
}