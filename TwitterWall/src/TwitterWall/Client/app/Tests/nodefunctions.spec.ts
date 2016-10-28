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

    it("translation moves node to the correct position", () => {

        let translationArray = NodeFunctions.generateTranslation(new Vector(0, 0), new Vector(100, 100), 100);

        expect(translationArray[translationArray.length - 1]).toEqual(new Vector(100, 100));
    });

    it("translation has correct number of steps", () => {
        let steps = 100;
        let translationArray = NodeFunctions.generateTranslation(new Vector(0, 0), new Vector(100, 100), steps);

        expect(translationArray.length).toEqual(steps);
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
