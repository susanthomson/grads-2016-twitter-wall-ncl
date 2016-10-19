import { AppComponent } from "../Components/app.component";
import { BufferTweets } from "../Components/buffertweets.component";
import { TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { Tweet } from "../Models/tweet";
import { Person } from "../Models/person";
import { TweetStreamMock } from "../Services/tweetstream.service.mock";
import { TweetStream } from "../Services/tweetstream.service";

let component: BufferTweets;
let fixture: ComponentFixture<BufferTweets>;

describe("Admin panel buffer tweets component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BufferTweets],
            providers: [
                {provide: TweetStream, useClass: TweetStreamMock}
            ]
        });

        fixture = TestBed.createComponent(BufferTweets);
        component = fixture.componentInstance;
    });

    it("Add element", () => {
        component.bufferTweets.push(new Tweet(1, 1, "", "", new Date(), "", "", [], []));
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(1);
    });

    it("Remove element", () => {
        component.bufferTweets.push(new Tweet(1, 1, "", "", new Date(), "", "", [], []));
        component.removeTweet(0);
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(0);
    });

    it("Approve tweet", () => {
        component.bufferTweets.push(new Tweet(1, 1, "", "", new Date(), "", "", [], []));
        component.changeApproval(0);
        fixture.detectChanges();
        expect(component.isTweetApproved(0)).toEqual(true);
    });

    it("Consume a normal tweet", () => {
        component.bufferTweets.push(new Tweet(0, 0, "", "", new Date(), "", "", [], []));
        fixture.detectChanges();
        component.changeApproval(0);
        component.popFirst();
        expect(component.bufferTweets.length).toEqual(0);
    });

    it("Consume a speaker's tweet", () => {
        component.bufferTweets.push(new Tweet(0, 0, "", "someone", new Date(), "", "", [], []));
        component.bufferTweets.push(new Tweet(0, 0, "", "noone", new Date(), "", "", [], []));
        let newTweet = new Tweet(0, 0, "", "testuser", new Date(), "", "", [], []);
        component.bufferTweets.push(newTweet);
        component.bufferUsers.push(new Person(2, "testuser"));
        fixture.detectChanges();
        component.changeApproval(0);
        let testTweet = component.popFirst();
        expect(testTweet).toEqual(newTweet);
    });
});
