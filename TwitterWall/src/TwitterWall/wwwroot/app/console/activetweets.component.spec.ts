import { AppComponent } from "../app.component";
import { ActiveTweets } from "./activetweets.component";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Tweet } from "../tweet";

let component: ActiveTweets;
let fixture: ComponentFixture<ActiveTweets>;

describe("Admin panel active tweets component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ActiveTweets]
        });

        fixture = TestBed.createComponent(ActiveTweets);
        component = fixture.componentInstance;
    });

    it("Add element", () => {
        component.addTweet(new Tweet(1, 1, "", "", new Date(), "", ""));
        fixture.detectChanges();
        expect(component.activeTweets.length).toEqual(1);
    });

    it("Remove element", () => {
        component.addTweet(new Tweet(1, 1, "", "", new Date(), "", ""));
        component.removeTweet(0);
        fixture.detectChanges();
        expect(component.activeTweets.length).toEqual(0);
    });
});
