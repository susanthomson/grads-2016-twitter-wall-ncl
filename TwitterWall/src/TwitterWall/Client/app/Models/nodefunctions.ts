import { Vector } from "../Models/vector";

export class NodeFunctions {
    static decreaseRadius(node, minRadius, step, context): void {
        if (node.radius <= minRadius) {
            node.isDecreasing = false;
            node.isDisplayed = false;
            node.isFixed = false;
            context.translationPoint = 0;
            context.points = [];
            return;
        }
        node.radius -= step;
    };

    static increaseRadius(node, maxRadius, step, timeToDisplay, context): void {
        if (node.radius >= maxRadius) {
            node.isIncreasing = false;
            setTimeout(() => {
                context.showTweet = false;

                // Set time for circle to decrease to be after tweet fades
                setTimeout(() => {
                    node.isDecreasing = true;
                }, 1000);
            }, timeToDisplay);
            context.showTweet = true;
            return;
        }
        node.isDisplayed = true;
        node.isFixed = true;
        node.radius += step;
    };

    static collide(nodes): void {
        for ( let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                let node = nodes[i];
                let node2 = nodes[j];

                let node1Pos = new Vector(node.x, node.y);
                let node2Pos = new Vector(node2.x, node2.y);

                let nodeDistance = Math.sqrt((node1Pos.x - node2Pos.x) * (node1Pos.x - node2Pos.x) + (node1Pos.y - node2Pos.y) * (node1Pos.y - node2Pos.y));

                if (nodeDistance < node.radius + node2.radius) {
                    // Collision happened
                    let pen = node.radius + node2.radius - nodeDistance;
                    let collision = node1Pos.subtract(node2Pos);
                    let norm = collision.divide(nodeDistance);

                    nodes[i].x = node.x + (norm.x * (pen / 2));
                    nodes[i].y = node.y + (norm.y * (pen / 2));
                    nodes[j].x = node2.x - (norm.x * (pen / 2));
                    nodes[j].y = node2.y - (norm.y * (pen / 2));
                }
            }
        }
    };

    static generateTranslation(p1: Vector, p2: Vector, frames): Vector[] {
        if (p1.x === p2.x && p1.y === p2.y) {
            return [];
        }

        // Need to add extra step for last position
        frames = frames - 1;

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let incrementX = dx / frames;
        let incrementY = dy / frames;
        let a = new Array();

        a.push(p1);
        for (let frame = 0; frame < frames - 1; frame++) {
            a.push(new Vector(p1.x + (incrementX * frame), p1.y + (incrementY * frame)));
        }
        a.push(p2);
        return (a);
    };
}
