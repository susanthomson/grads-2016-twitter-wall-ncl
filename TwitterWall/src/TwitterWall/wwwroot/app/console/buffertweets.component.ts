import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
@Component({
    selector: "buffer-tweets",
    template: `
        <h4>Tweet queue</h4>
        <ul>
            <li *ngFor="let tweet of bufferTweets; let i=index" (click)="changeApproval(i)" [ngClass]="{'approved': isTweetApproved(i)}">
                '{{tweet.Body}}', by @{{tweet.Handle}} at {{tweet.Date}}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTweet(i)"></span>
            </li>
        </ul>
        `
})
export class BufferTweets {
    bufferTweets: Tweet[] = [];
    counter: number = 0;
    approvals: Object = {};
    constructor() {
        setInterval(() => {
            this.generateTweet();
        }, 3000);
    }

    generateTweet(): void {
        if (this.bufferTweets.length < 5) {
            this.counter += 1;
            this.bufferTweets.push(new Tweet(this.counter, this.counter, "Fake Tweet " + this.counter, "FakeHandle", new Date(), "Fake", "http://blog.eckelberry.com/wp-content/uploads/2016/02/Fake-Companies-List-Announced-By-TCS-and-IBM-2015.png"));
        }
    }

    changeApproval(index: number): void {
        this.approvals[this.bufferTweets[index].TweetId] = !this.approvals[this.bufferTweets[index].TweetId];
    }

    isTweetApproved(index: number): boolean {
        return this.approvals[this.bufferTweets[index].TweetId];
    }

    consume(): Tweet {
        let tweet = this.bufferTweets.find((el, i) => {
            return this.approvals[this.bufferTweets[i].TweetId];
        });
        if (tweet) {
            let index = this.bufferTweets.indexOf(tweet);
            this.removeTweet(index);
            return tweet;
        }
        return null;
    }

    removeTweet(index: number): void {
        delete this.approvals[this.bufferTweets[index].TweetId];
        this.bufferTweets.splice(index, 1);
    }
}
