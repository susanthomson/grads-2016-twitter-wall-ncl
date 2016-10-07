import { AppComponent } from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { Injectable } from "@angular/core";
import { TweetStream } from "./tweetstream.service";
import { TestBed } from "@angular/core/testing";
import { Subject } from "rxjs/Subject";
import { Tweet } from "./tweet";
import { TweetStreamMock } from "./tweetstream.service.mock";


describe("Twittercard component tests", () => {

    let fixture;
    let component;
    let tweetService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TwitterCard ],
            providers: [{provide: TweetStream, useClass: TweetStreamMock}]
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