import { Tweet } from "./tweet";

export class Queue {

    private queueSize: number;
    private tweets: Tweet[];

    constructor(queueSize: number) {
        this.tweets = [];
        this.queueSize = queueSize < 0 ? 0 : queueSize;
    }

    getQueue(): Tweet[] {
        return this.tweets;
    }

    getLength(): number {
        return this.tweets.length;
    }

    getQueueSize(): number {
        return this.queueSize;
    }

    push(tweet: Tweet): boolean {
        if ((this.getLength() < this.queueSize) || this.queueSize === 0) {
            this.tweets.push(tweet);
            return true;
        }
        return false;
    }

    peek(): Tweet {
        return this.tweets[this.getLength() - 1];
    }

    pop(): Tweet {
        return this.tweets.pop();
    }
}