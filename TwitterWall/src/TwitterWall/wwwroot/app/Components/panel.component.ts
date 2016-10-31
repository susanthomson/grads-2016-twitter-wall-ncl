import { ViewChild, Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { ActiveTweets } from "./activetweets.component";
import { BufferTweets } from "./buffertweets.component";
import { BannedUsers } from "./bannedusers.component";
import { TwitterLogin } from "../Services/twitterlogin.service";
import { TweetStream } from "../Services/tweetstream.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: "admin-panel",
    template: `
        <div class="admin-panel container-fluid">
            <div class="container" *ngIf="!loggedIn">
                <p>You need to login to view this page</p>
                <button (click)="login()">Login</button>
                <span *ngIf="loginError">Error</span>
            </div>
            <div class="initial-loader" *ngIf="loading && loggedIn">
                <h3 class="text-center">Loading Admin Panel</h3>
                <div class="spinner spinner-lg"></div>
            </div>
            <div *ngIf="!loading && loggedIn">
                <div class="stream-status">
                    <button (click)="changeCredentials()">Start Stream</button>
                    <p>STREAM STATUS: {{streamStatus}}</p>
                </div>
                <div class="stream-panels clearfix row">
                    <div class="col-md-8 row">
                        <subscriptions></subscriptions>
                    </div>
                    <div class="col-md-4">
                        <banned-users></banned-users>
                    </div>
                </div>
                <div class="live-tweets">
                    <div class="panel panel-default">
                        <div class="panel-heading"><p class="panel-title">Live tweets</p></div>
                        <div class="panel-body">
                            <active-tweets></active-tweets>
                        </div>
                    </div>
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
    streamStatus: string = "Loading...";

    streamStatusTimer: any;
    streamEvent: { Id: number, Name: string };

    constructor(private twitterLogin: TwitterLogin, private tweetStream: TweetStream, private router: Router, private route: ActivatedRoute) {
        this.route.params.forEach((params: Params) => {
            this.tweetStream.setEvent(params["id"]);
        });
        this.loading = !tweetStream.isInitialised();
        this.tweetStream.initialisationChanged$.subscribe((initialised) => {
            if (initialised) {
                this.loading = !initialised;
            }
        });

        this.tweetStream.streamStatusChanged$.subscribe((status) => {
            this.streamStatus = status;
        });

        if (window.sessionStorage.getItem("token") !== null && window.sessionStorage.getItem("handle") !== null) {
            this.loggedIn = true;
        }

        this.twitterLogin.loginErrorEvent$.subscribe(() => {
            this.loginError = true;
        });

        this.tweetStream.eventChanged$.subscribe((newEvent) => {
            this.streamEvent = newEvent;
        });

        this.streamStatusTimer = setInterval(() => {
            this.getStreamStatus();
        }, 10000);
    }

    ngOnDestroy(): void {
        clearInterval(this.streamStatusTimer);
        this.tweetStream.stopHubConnection();
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
        this.twitterLogin.changeCredentials(this.streamEvent.Name);
    }

    getStreamStatus(): void {
        this.tweetStream.getStreamStatus();
    }
}
