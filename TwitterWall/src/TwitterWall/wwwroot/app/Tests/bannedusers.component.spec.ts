import { AppComponent } from "../Components/app.component";
import { BannedUsers } from "../Components/bannedusers.component";
import { ActiveTweets } from "../Components/activetweets.component";
import { Tweet } from "../Models/tweet";
import { TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { TweetStreamMock } from "../Services/tweetstream.service.mock";
import { TweetStream } from "../Services/tweetstream.service";

let component: BannedUsers;
let fixture: ComponentFixture<BannedUsers>;

describe("Admin Panel Banned Users Component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BannedUsers],
            providers: [
                { provide: TweetStream, useClass: TweetStreamMock }
            ]
        });

       fixture = TestBed.createComponent(BannedUsers);
       component = fixture.componentInstance;
    });

    it("Ban user", () => {
        const newTweet: Tweet = new Tweet(0, 0, "hello world", "marcusrc", new Date().toString(), "marcus", "", [], false);
        component.banUser(newTweet);
        expect(component.bannedUsers.length).toBe(1);
    });

    it("Unban user",
        () => {
            const newTweet: Tweet = new Tweet(0, 0, "hello world", "marcusrc", new Date().toString(), "marcus", "", [], false);
            component.banUser(newTweet);
            component.unbanUser(0);
            expect(component.bannedUsers.length).toBe(0);
        });

});
