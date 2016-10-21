import { ViewChild, Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { ActiveTweets } from "./activetweets.component";
import { BufferTweets } from "./buffertweets.component";
import { TwitterLogin } from "../Services/twitterlogin.service";
import { TweetStream } from "../Services/tweetstream.service";

@Component({
    selector: "admin-panel",
    template: `
        <div class="container-fluid">
            <div class="row">
                <span *ngIf="loginError">Error</span>
                <button *ngIf="!loggedIn" (click)="login()">Login</button>
                <span *ngIf="loading && loggedIn"><div class="loader"></div><h3 class="text-center">Loading Admin Panel, please wait...</h3></span>
                <div *ngIf="!loading && loggedIn">
                    <div class="col-sm-6">
                        <button (click)="changeCredentials()">Change Credentials</button>
                        <div class="panel panel-default">
                            <div class="panel-heading"><p class="panel-title">Live tweets</p></div>
                            <div class="panel-body">
                                <active-tweets></active-tweets>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <buffer-tweets></buffer-tweets>
                                <button type="button" (click)="consumeTweet()">Display next</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <subscriptions></subscriptions>
                </div>
            </div>
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
