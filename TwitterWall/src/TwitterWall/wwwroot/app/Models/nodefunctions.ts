import { Vector } from "../Models/vector";

export class NodeFunctions {
    static decreaseRadius(node, minRadius, radius, context): void {
        if (node.radius <= minRadius) {
            node.isDecreasing = false;
            node.isDisplayed = false;
            node.isTranslating = false;
            node.isFixed = false;
            return;
        }
        node.radius = radius;
    };

    static increaseRadius(node, maxRadius, radius, timeToDisplay, context): void {
        if (node.radius >= maxRadius) {
            node.isIncreasing = false;
            setTimeout(() => {
                context.showTweet = false;
                node.isDecreasing = true;
                node.scaleStartTime = Date.now();
            }, timeToDisplay);
            return;
        }
        context.showTweet = true;
        node.isDisplayed = true;
        node.radius = radius;
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

                    if (node.isTranslating || node.isDisplayed) {
                        node2.x = node2.x - (norm.x * (pen / 2)) * 2;
                        node2.y = node2.y - (norm.y * (pen / 2)) * 2;
                    }
                    else if (node2.isTranslating || node2.isDisplayed) {
                        node.x = node.x + (norm.x * (pen / 2)) * 2;
                        node.y = node.y + (norm.y * (pen / 2)) * 2;
                    }
                    else {
                        node.x = node.x + (norm.x * (pen / 2));
                        node.y = node.y + (norm.y * (pen / 2));
                        node2.x = node2.x - (norm.x * (pen / 2));
                        node2.y = node2.y - (norm.y * (pen / 2));
                    }
                }
            }
        }
    };
}
