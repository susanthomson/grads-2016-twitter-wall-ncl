import { Subscriptions } from "../Components/subscriptions.component";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { TweetStreamMock } from "../Services/tweetstream.service.mock";
import { TweetStream } from "../Services/tweetstream.service";
import { FormsModule } from "@angular/forms";

let component: Subscriptions;
let fixture: ComponentFixture<Subscriptions>;

describe("Subscription component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [Subscriptions],
            providers: [{ provide: TweetStream, useClass: TweetStreamMock }]
        });

        fixture = TestBed.createComponent(Subscriptions);
        component = fixture.componentInstance;
    });

    it("Add track", () => {
        component.inputTrack = "Test";
        component.addTrack();
        fixture.detectChanges();
        expect(component.tracks.length).toEqual(1);
    });

    it("Remove track", () => {
        component.tracks.push({ Id: 1, Value: "", Type: "" });
        component.removeTrack(0);
        expect(component.tracks.length).toEqual(0);
    });

});
