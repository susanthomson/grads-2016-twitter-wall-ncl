import { AppComponent } from "../Components/app.component";
import { BufferTweets } from "./buffertweets.component";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Tweet } from "../Models/tweet";

let component: BufferTweets;
let fixture: ComponentFixture<BufferTweets>;

describe("Admin panel buffer tweets component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BufferTweets]
        });

        fixture = TestBed.createComponent(BufferTweets);
        component = fixture.componentInstance;
    });

    it("Add element", () => {
        component.generateTweet();
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(1);
    });

    it("Remove element", () => {
        component.generateTweet();
        component.removeTweet(0);
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(0);
    });

    it("Approve tweet", () => {
        component.generateTweet();
        component.changeApproval(0);
        fixture.detectChanges();
        expect(component.isTweetApproved(0)).toEqual(true);
    });

    it("Consume approved tweet", () => {
        component.generateTweet();
        component.changeApproval(0);
        component.consume();
        fixture.detectChanges();
        expect(component.bufferTweets.length).toEqual(0);
    });
});
