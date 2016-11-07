import { AppComponent } from "../Components/app.component";
import { BubbleComponent } from "../Components/bubble.component";
import { TestBed } from "@angular/core/testing";
import { Tweet } from "../Models/tweet";
import { Vector } from "../Models/vector";
import { TweetStreamMock } from "../Services/tweetstream.service.mock";
import { TweetStream } from "../Services/tweetstream.service";
import { Router, ActivatedRoute } from "@angular/router";

let bubbleComponent;
let fixture;

class RouterMock {
    url = "/";
}

class ActivatedRouteMock {
    params = ["route"];
}

describe("d3 bubble component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BubbleComponent],
            providers: [{ provide: TweetStream, useClass: TweetStreamMock },
                { provide: Router, useClass: RouterMock }, { provide: ActivatedRoute, useClass: ActivatedRouteMock }]
        });

        fixture = TestBed.createComponent(BubbleComponent);
        bubbleComponent = fixture.componentInstance;
    });

    it("sets up nodes correctly", () => {
        fixture.detectChanges();
        expect(bubbleComponent.nodes).toBeDefined();
    });

    it("sets up force correctly", () => {
        fixture.detectChanges();
        expect(bubbleComponent.force).toBeDefined();
    });

    it("add node adds a new node to the list of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        bubbleComponent.addNode(0, 0, new Tweet(0, 0, "", "", new Date().toString(), "", "egg.png", [], false));
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBe(numOfNodes + 1);
    });

    it("only allow maximum number of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        for (let i = 0; i < 1000; i++) {
            bubbleComponent.addNode(i, i, new Tweet(0, 0, "", "", new Date().toString(), "", "egg.png", [], false));
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBeLessThan(1000);
    });

    it("remove node deletes a node from the list of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        bubbleComponent.addNode(0, 0, new Tweet(0, 0, "", "", new Date().toString(), "", "egg.png", [], false));
        bubbleComponent.addNode(1, 1, new Tweet(1, 1, "", "", new Date().toString(), "", "egg.png", [], false));
        bubbleComponent.removeNode(0);

        // Animation reduces node radius to zero
        bubbleComponent.nodes[0].radius = 0;
        bubbleComponent.tick();

        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBe(numOfNodes + 1);
    });

    it("duplicate tweets not inserted", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        bubbleComponent.addNode(0, 0, new Tweet(5, 5, "", "", new Date().toString(), "", "egg.png", [], false));
        bubbleComponent.addNode(0, 0, new Tweet(5, 5, "", "", new Date().toString(), "", "egg.png", [], false));

        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBe(numOfNodes + 1);
    });

    it("only allow maximum number of nodes", () => {
        fixture.detectChanges();
        for (let i = 0; i < 1000; i++) {
            bubbleComponent.removeNode(0);
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).not.toBeLessThan(0);
    });
});