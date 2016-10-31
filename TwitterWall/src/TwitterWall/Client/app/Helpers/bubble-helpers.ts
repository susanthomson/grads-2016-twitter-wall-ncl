import BezierEasing from "../Helpers/bezier-easing";
import { Vector } from "../Models/vector";

export function almostEqual(v1, v2, errorMargin = 1): boolean {
    return Math.abs(v1 - v2) <= errorMargin;
}

function bezier(b1, b2, b3, b4) {
    return (t, b, c, d, round) => {
        const ease = BezierEasing(b1, b2, b3, b4);
        const y = ease(t / d);
        const value = (c * y) + b;
        return round ? Math.round(value) : value;
    };
}
export function easeOut(t, b, c, d, round = false) {
    const ease = bezier(0.75, 0.05, 0.25, 1);
    return ease(t, b, c, d, round);
};

export function scaleInEase(t, b, c, d, round = false) {
    const ease = bezier(0.9, 0.05, 0.4, 1);
    return ease(t, b, c, d, round);
}

export function scaleOutEase(t, b, c, d, round = false) {
    const ease = bezier(0.6, 0.05, 0.15, 1);
    return ease(t, b, c, d, round);
}

export function shrinkBubble(
    node, startTime, shrinkTime, minRadius, maxRadius, minScale,
    maxScale, transformOpacity = true
): void {
    let radius = easeOut(
        Date.now() - startTime, minRadius,
        maxRadius - minRadius, shrinkTime
    );
    let newRadius = maxRadius + minRadius - Math.max(radius, minRadius);
    let scale = scaleOutEase(
        Date.now() - startTime, minScale,
        maxScale - minScale, shrinkTime
    );
    let newScale = maxScale + minScale - Math.max(scale, minScale);

    if (almostEqual(node.radius, minRadius, 1)) {
        node.isDecreasing = false;
        node.isDisplayed = false;
        node.isTranslating = false;
        node.fixed = false;
        return;
    }
    node.radius = newRadius;
    node.scale = newScale;
    if (transformOpacity) {
        node.opacity = (newRadius - minRadius) / (maxRadius - minRadius);
    }
};

export function growBubble(
    node, timeToDisplay, growTime, minRadius, maxRadius, context
): void {
    let radius = easeOut(
        Date.now() - node.scaleStartTime, minRadius,
        maxRadius - minRadius, growTime
    );
    let newRadius = Math.min(radius, maxRadius);
    const minScale = minRadius / maxRadius;
    const maxScale = 1;

    let scale = scaleInEase(
        Date.now() - node.scaleStartTime, minScale,
        maxScale - minScale, growTime
    );
    let newScale = Math.min(scale, maxScale);

    if (almostEqual(node.radius, maxRadius, 1)) {
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
    node.radius = newRadius;
    node.scale = newScale;
    node.opacity = (newRadius - minRadius) / (maxRadius - minRadius);
};

export function collide(nodes): void {
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
