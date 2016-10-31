import * as bubbleHelpers from "../Helpers/bubble-helpers";
import { Vector } from "../Models/vector";

let nodes;
describe("node functions", () => {
    beforeEach(() => {
        nodes = [
            {
                radius: 10
            }
        ];
    });

    it("node radius increases", () => {
        bubbleHelpers.growBubble(nodes[0], 0, 100, 10, 20, {});
        expect(nodes[0].radius).toBeGreaterThan(10);
    });

    it("node radius cannot increase past max", () => {
        bubbleHelpers.growBubble(nodes[0], 0, 100, 10, 10, {});
        expect(nodes[0].radius).not.toBeGreaterThan(10);
    });

    // it("node radius decreases", () => {
    //     bubbleHelpers.shrinkBubble(nodes[0], Date.now(), 100, 0, 20, 1, 1);
    //     expect(nodes[0].radius).toBeLessThan(20);
    // });
    //
    // it("node radius cannot decrease past min", () => {
    //     bubbleHelpers.shrinkBubble(nodes[0], Date.now(), 100, 20, 20, 1, 1);
    //     expect(nodes[0].radius).not.toBeLessThan(20);
    // });
});
