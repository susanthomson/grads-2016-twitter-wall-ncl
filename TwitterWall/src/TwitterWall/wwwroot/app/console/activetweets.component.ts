import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
@Component({
    selector: "active-tweets",
    template: `
        <h4>Display tweets</h4>
        <ul>
            <li *ngFor="let tweet of activeTweets; let i=index">
                '{{tweet.Body}}', by @{{tweet.Handle}} at {{tweet.Date}}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTweet(i)"></span>
            </li>
        </ul>
        `
})
export class ActiveTweets {
    activeTweets: Tweet[] = [];
    constructor() {

    }

    removeTweet(index: number): void {
        this.activeTweets.splice(index, 1);
    }

    addTweet(tweet: Tweet): void {
        this.activeTweets.push(tweet);
    }
}
