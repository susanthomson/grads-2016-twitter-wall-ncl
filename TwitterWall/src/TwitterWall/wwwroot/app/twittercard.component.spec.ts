import { AppComponent } from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { Injectable } from "@angular/core";
import { TweetStream } from "./tweetstream.service";
import { TestBed } from "@angular/core/testing";
import { Subject } from "rxjs/Subject";
import { Tweet } from "./tweet";

@Injectable()
class TweetStreamService {
    private tweetsChanged = new Subject<Tweet[]>();
    private tweets: Tweet[] = [];
    public changeTweets$ = this.tweetsChanged.asObservable();
    private tweet1: Tweet;
    private tweet2: Tweet;

    constructor() {
        this.tweet1 = new Tweet(1, 23232, "Hello World", "Jesus", new Date(), "Jesus Christ", "https://www.heaven.clouds");
        this.tweet2 = new Tweet(2, 343454, "Hello Mars", "Satan", new Date(), "Lucifer", "https://www.hell.underground");
        this.tweets.push(this.tweet1);
        this.tweets.push(this.tweet2);
    }

    pushTweets(): void {
        this.tweetsChanged.next(this.tweets);
    }
};

describe("Twittercard component tests", () => {

    let fixture;
    let component;
    let tweetService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TwitterCard ],
            providers: [{provide: TweetStream, useClass: TweetStreamService}]
        });

        fixture = TestBed.createComponent(TwitterCard);
        component = fixture.componentInstance;

        tweetService = TestBed.get(TweetStream);
    });

    it("should create component with initial tweets", () => {
        fixture.detectChanges();
        component.tweetStream.pushTweets();
        expect(component.tweets.length).toBe(2);
    });

    it("should remove a specific tweet and return correct length", () => {
        fixture.detectChanges();
        component.tweetStream.pushTweets();
        component.removeTweet(2);
        expect(component.tweets.length).toBe(1);
    });

    it("should remove a specific tweet and return correct id", () => {
        fixture.detectChanges();
        component.tweetStream.pushTweets();
        component.removeTweet(2);
        expect(component.tweets[0].Id).toBe(1);
    });
});
