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
        <div class="container-fluid">
            <div class="row">
                <div *ngIf="!loggedIn">
                    <p>You need to login to view this page</p>
                    <button (click)="login()">Login</button>
                    <span *ngIf="loginError">Error</span>
                </div>
                <span *ngIf="loading && loggedIn"><div class="loader"></div><h3 class="text-center">Loading Admin Panel, please wait...</h3></span>
                <div *ngIf="!loading && loggedIn">
                    <div class="col-sm-6">
                        <button (click)="changeCredentials()">Change Credentials</button>
                        <p>STREAM STATUS: {{streamStatus}} </p>
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
                        <banned-users></banned-users>
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
            var streamName = params["id"];
            this.tweetStream.setEvent(streamName);
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
