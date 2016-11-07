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
});