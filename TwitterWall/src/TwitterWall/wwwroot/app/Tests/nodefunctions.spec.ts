import { NodeFunctions } from "../Models/nodefunctions";
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
        NodeFunctions.increaseRadius(nodes[0], 20, 1, 1000, {});
        expect(nodes[0].radius).toBeGreaterThan(10);
    });

    it("node radius cannot increase past max", () => {
        for (let i = 0; i < 10000; i++) {
            NodeFunctions.increaseRadius(nodes[0], 20, 1, 1000, {});
        }
        expect(nodes[0].radius).toBeLessThan(22);
    });

    it("node radius decreases", () => {
        NodeFunctions.decreaseRadius(nodes[0], 5, 1, {});
        expect(nodes[0].radius).toBeLessThan(10);
    });

    it("node radius cannot decrease past min", () => {
        for (let i = 0; i < 10000; i++) {
            NodeFunctions.decreaseRadius(nodes[0], 5, 1, {});
        }
        expect(nodes[0].radius).toBeGreaterThan(0);
    });
});
