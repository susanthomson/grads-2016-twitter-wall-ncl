import { AppComponent } from "./app.component";
import { BubbleComponent } from "./bubble.component";
import { TestBed } from "@angular/core/testing";
import { Vector } from "./vector";

let bubbleComponent;
let fixture;

describe("d3 bubble component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BubbleComponent]
        });

        fixture = TestBed.createComponent(BubbleComponent);
        bubbleComponent = fixture.componentInstance;
    });

    it("sets up canvas correctly", () => {
        fixture.detectChanges();
        expect(bubbleComponent.canvas).toBeDefined();
    });

    it("sets up nodes correctly", () => {
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBeGreaterThan(1);
    });

    it("sets up force correctly", () => {
        fixture.detectChanges();
        expect(bubbleComponent.force).toBeDefined();
    });

    it("translation moves node to the correct position", () => {
        fixture.detectChanges();
        let translationArray = bubbleComponent.generateTranslation(new Vector(0, 0), new Vector(100, 100), 100);

        expect(translationArray[translationArray.length - 1]).toEqual(new Vector(100, 100));
    });

    it("translation has correct number of steps", () => {
        fixture.detectChanges();
        let steps = 100;
        let translationArray = bubbleComponent.generateTranslation(new Vector(0, 0), new Vector(100, 100), steps);

        expect(translationArray.length).toEqual(steps);
    });

    it("add node adds a new node to the list of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        bubbleComponent.addNode();
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBe(numOfNodes + 1);
    });

    it("only allow maximum number of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        for (let i = 0; i < 1000; i++) {
            bubbleComponent.addNode();
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBeLessThan(1000);
    });

    it("remove node deletes a node to the list of nodes", () => {
        fixture.detectChanges();
        let numOfNodes = bubbleComponent.nodes.length;
        bubbleComponent.addNode();
        bubbleComponent.addNode();
        bubbleComponent.removeNode(1);
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBe(numOfNodes + 1);
    });

    it("only allow maximum number of nodes", () => {
        fixture.detectChanges();
        for (let i = 0; i < 1000; i++) {
            bubbleComponent.removeNode(1);
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes.length).toBeGreaterThan(0);
    });

    it("node radius increases", () => {
        fixture.detectChanges();
        bubbleComponent.increaseRadius(bubbleComponent.nodes[1]);
        fixture.detectChanges();
        expect(bubbleComponent.nodes[1].radius).toBeGreaterThan(100);
    });

    it("node radius cannot increase past max", () => {
        fixture.detectChanges();
        for (let i = 0; i < 10000; i++) {
            bubbleComponent.increaseRadius(bubbleComponent.nodes[1]);
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes[1].radius).toBeLessThan(10000);
    });

    it("node radius decreases", () => {
        fixture.detectChanges();
        bubbleComponent.nodes[1].radius = 200;
        bubbleComponent.decreaseRadius(bubbleComponent.nodes[1]);
        fixture.detectChanges();
        expect(bubbleComponent.nodes[1].radius).toBeLessThan(200);
    });

    it("node radius cannot decrease past min", () => {
        fixture.detectChanges();
        for (let i = 0; i < 10000; i++) {
            bubbleComponent.decreaseRadius(bubbleComponent.nodes[1]);
        }
        fixture.detectChanges();
        expect(bubbleComponent.nodes[1].radius).toBeGreaterThan(0);
    });
});
