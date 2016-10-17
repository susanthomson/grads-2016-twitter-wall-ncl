import { ViewChild, Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { ActiveTweets } from "./activetweets.component";
import { BufferTweets } from "./buffertweets.component";
import { TweetStream } from "../Services/tweetstream.service";

@Component({
    selector: "admin-panel",
    template: `
        <h3>Admin Console</h3>
        <h4 *ngIf="loading">Connecting to stream...</h4>
        <div *ngIf="!loading">
            <active-tweets></active-tweets>
            <button type="button" (click)="consumeTweet()">Display next</button>
            <buffer-tweets></buffer-tweets>
            <subscriptions></subscriptions>
        </div>
        `
})
export class AdminPanelComponent {
    @ViewChild(ActiveTweets) activeTweets: ActiveTweets;
    @ViewChild(BufferTweets) bufferTweets: BufferTweets;
    loading: boolean = true;
    constructor(private tweetStream: TweetStream) {
        this.loading = !tweetStream.isInitialised();
        this.tweetStream.initialisationChanged$.subscribe((initialised) => {
            this.loading = !initialised;
        });
    }

    private consumeTweet(): void {
        let tweet = this.bufferTweets.popFirst();
        if (tweet) {
            this.activeTweets.addTweet(tweet);
        }
    }    
}
