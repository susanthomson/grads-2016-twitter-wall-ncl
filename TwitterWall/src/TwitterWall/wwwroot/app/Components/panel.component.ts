import { ViewChild, Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { ActiveTweets } from "./activetweets.component";
import { BufferTweets } from "./buffertweets.component";
import { TwitterLogin } from "../Services/twitterlogin.service";
import { TweetStream } from "../Services/tweetstream.service";

@Component({
    selector: "admin-panel",
    template: `
        <h3>Admin Console</h3>
        <button *ngIf="!loggedIn" (click)="login()">Login</button>
        <span *ngIf="loginError">Error</span>
        <h4 *ngIf="loading && loggedIn">Connecting to stream...</h4>
        <div *ngIf="!loading && loggedIn">
            <button (click)="changeCredentials()">Change Credentials</button>
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
    loggedIn: boolean = false;
    loginError: boolean = false;

    constructor(private twitterLogin: TwitterLogin, private tweetStream: TweetStream) {
        this.loading = !tweetStream.isInitialised();
        this.tweetStream.initialisationChanged$.subscribe((initialised) => {
            this.loading = !initialised;
        });

        if (window.sessionStorage.getItem("token") !== null && window.sessionStorage.getItem("handle") !== null) {
            this.loggedIn = true;
        }

        this.twitterLogin.loginErrorEvent$.subscribe(() => {
            this.loginError = true;
        });
    }

    private consumeTweet(): void {
        let tweet = this.bufferTweets.popFirst();
        if (tweet) {
            this.activeTweets.addTweet(tweet);
        }
    }

    login(): void {
        this.loginError = false;
        this.twitterLogin.login();
    }

    changeCredentials(): void {
        this.loginError = false;
        this.twitterLogin.changeCredentials();
    }
}
