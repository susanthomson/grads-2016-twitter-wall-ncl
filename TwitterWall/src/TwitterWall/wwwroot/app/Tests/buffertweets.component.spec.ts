import { AppComponent } from "../Components/app.component";
import { BufferTweets } from "../Components/buffertweets.component";
import { TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { Tweet } from "../Models/tweet";
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

    it("Consume approved tweet", () => {
        component.bufferTweets.push(new Tweet(0, 0, "", "", new Date(), "", "", [], []));
        component.changeApproval(0);
        component.popFirst();
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(0);
    });
});
