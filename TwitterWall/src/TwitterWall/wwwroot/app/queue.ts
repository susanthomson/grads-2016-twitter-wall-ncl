import { Tweet } from "./tweet";

export class Queue {

    private queueSize: number;
    private tweets: Tweet[];

    constructor(queueSize: number) {
        this.tweets = [];
        this.queueSize < 0 ? this.queueSize = 0 : this.queueSize = queueSize;
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

    setQueueSize(size: number) {
        size < 0 ? this.queueSize = 0 : this.queueSize = size;
    }

    push(tweet: Tweet): void {
        if ((this.getLength() < this.queueSize) || this.queueSize === 0) {
            this.tweets.push(tweet);
        }
    }

    peek(): Tweet {
        return this.tweets[this.getLength() - 1];
    }

    pop(): Tweet {
        return this.tweets.pop();
    }
}