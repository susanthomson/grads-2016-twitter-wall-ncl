import { Component, OnInit } from "@angular/core";
import { Vector } from "./vector";
import * as d3 from "d3";

const MAX_NODES = 20;
const MIN_NODES = 10;
const MAX_RADIUS = 400;
const MIN_RADIUS = 100;
const INCREASE_STEP = 2;
const IMAGE_SIZE = 200;
const TIME_BETWEEN_EXPAND = 2000;
const TIME_TO_SHOW = 5000;
const TRANSLATION_TICKS = 100;
const GRAVITY = 0.01;

@Component({
    selector: "bubble-canvas",
    template: `
        <button (click)="goFullScreen()">Fullscreen</button>
        <button (click)="removeTest()">Remove 1</button>
        <div id="bubble-canvas" (click)="addNode()"></div>
    `
})
export class BubbleComponent implements OnInit {
    context: any;
    width: number;
    height: number;
    nodes: any;
    root: any;
    force: any;
    translationPoint: number = 0;
    points: Vector[] = [];
    displayPoint: Vector;

    // Use only until tweets are implemented
    images: HTMLImageElement[] = [];
    imageNumber: number = 0;

    // Test images only, will be replaced with tweet avatar url
    urls: string[] = [
        "http://pbs.twimg.com/profile_images/708631138407940096/M0Ucjylz.jpg",
        "http://pbs.twimg.com/profile_images/927999448/angsana-new-duck.png",
        "http://pbs.twimg.com/profile_images/1429782706/tuxlkml.png",
        "http://pbs.twimg.com/profile_images/1719552393/59__11_.jpg",
        "http://pbs.twimg.com/profile_images/209110358/Fuze_010.jpg",
        "http://pbs.twimg.com/profile_images/2672618717/711b4f143679a8d37ffddaf6db553f8b.jpeg",
        "http://pbs.twimg.com/profile_images/702521711640637441/IlvF4ZZ7.jpg",
        "http://pbs.twimg.com/profile_images/467140341628280833/haTxrNrP.png",
        "http://pbs.twimg.com/profile_images/455091038676209664/cv76n7TO.png",
        "http://pbs.twimg.com/profile_images/705123809133723649/LHFPpd4q.jpg",
        "http://pbs.twimg.com/profile_images/1368553975/twitter-netacad.png",
        "http://pbs.twimg.com/profile_images/1500659963/twitter03.gif",
        "http://pbs.twimg.com/profile_images/780763300791365632/3jAIB_a3.jpg"
    ];

    constructor() {
        this.urls.forEach(url => {
            this.images.push(this.preLoadImage(url));
        });
    };

    ngOnInit(): void {
        this.width = 1900;
        this.height = 800;
        this.displayPoint = new Vector(this.width / 2, this.height / 2);
        this.generateCanvas();
        this.populateNodes();
        this.setupForce();

        setInterval(() => {
            if (!this.nodes.every(n => !n.isDisplayed)) {
                return;
            }

            let i = Math.round((Math.random() * this.nodes.length - 2)) + 1;

            this.points = this.generateTranslation(new Vector(this.nodes[i].x, this.nodes[i].y), this.displayPoint, TRANSLATION_TICKS);
            this.nodes[i].isTranslating = true;
        }, TIME_BETWEEN_EXPAND);

        this.force.on("tick", this.tick.bind(this));
    };

    preLoadImage(url: string): HTMLImageElement {
        let img = new Image();
        img.src = url;
        return img;
    };

    generateCanvas(): void {
        const canvas = d3.select("#bubble-canvas").append("canvas")
                        .attr("width", this.width)
                        .attr("height", this.height)
                        .attr("id", "canv")
                        .attr("style", "background: black;");

        this.context = (canvas as any).node().getContext("2d");
    };

    populateNodes(): void {
        this.nodes = d3.range(MIN_NODES).map((d, i) => ({
                radius: MIN_RADIUS,
                image: this.images[i % this.urls.length],
                isDisplayed: false,
                isTranslating: false,
                isIncreasing: false,
                isDecreasing: false
            })),
            this.root = this.nodes[0];
        this.root.radius = 0;
        this.root.fixed = true;
    };

    setupForce(): void {
        this.force = d3.layout.force()
            .gravity(GRAVITY)
            .nodes(this.nodes)
            .size([this.width, this.height]);
        this.force.start();
    };

    translateBubble(node: any): void {
        if (this.translationPoint === this.points.length) {
            this.translationPoint = 0;
            this.points = [];
            node.isTranslating = false;
            node.isIncreasing = true;
            return;
        }

        node.x = this.points[this.translationPoint].x;
        node.y = this.points[this.translationPoint].y;
        this.translationPoint++;
    };

    generateTranslation(p1: Vector, p2: Vector, frames): Vector[] {
        if (p1.x === p2.x && p1.y === p2.y) {
            return;
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

    increaseRadius(node): void {
        if (node.radius >= MAX_RADIUS) {
          node.isIncreasing = false;
          setTimeout(function() {
            node.isDecreasing = true;
          }, TIME_TO_SHOW);
          return;
        }
        node.isDisplayed = true;
        node.isFixed = true;
        node.radius += INCREASE_STEP;
    };

    decreaseRadius(node): void {
        if (node.radius <= MIN_RADIUS) {
          node.isDecreasing = false;
          node.isDisplayed = false;
          node.isFixed = false;
          this.translationPoint = 0;
          this.points = [];
          return;
        }

        node.radius -= INCREASE_STEP;
    };

    collide(): void {
        for ( let i = 1; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                let node = this.nodes[i];
                let node2 = this.nodes[j];

                let node1Pos = new Vector(node.x, node.y);
                let node2Pos = new Vector(node2.x, node2.y);

                let nodeDistance = Math.sqrt((node1Pos.x - node2Pos.x) * (node1Pos.x - node2Pos.x) + (node1Pos.y - node2Pos.y) * (node1Pos.y - node2Pos.y));

                if (nodeDistance < node.radius + node2.radius) {
                    // Collision happened
                    let pen = node.radius + node2.radius - nodeDistance;
                    let collision = node1Pos.subtract(node2Pos);
                    let norm = collision.divide(nodeDistance);

                    this.nodes[i].x = node.x + (norm.x * (pen / 2));
                    this.nodes[i].y = node.y + (norm.y * (pen / 2));
                    this.nodes[j].x = node2.x - (norm.x * (pen / 2));
                    this.nodes[j].y = node2.y - (norm.y * (pen / 2));
                }
            }
        }
    };

    addNode(x: number = 0, y: number = 0): void {
        if (this.nodes.length < MAX_NODES) {
            this.nodes.push({x: x, y: y, image: this.images[this.imageNumber], radius: MIN_RADIUS});
            this.imageNumber = (this.imageNumber + 1) % this.images.length;
            this.force.start();
        }
    };

    removeNode(index: number): void {
        if (!this.nodes[index].isDisplayed && this.nodes.length > MIN_NODES && index !== 0) {
            this.nodes.splice(index, 1);
            this.force.resume();
        }
    };

    removeTest(): void {
        let i = Math.round(Math.random() * this.nodes.length - 2) + 1;
        this.removeNode(i);
    };

    goFullScreen(): void {
        // Can't use ViewChild here because canvas is generated dynamically by d3
        let elem = document.getElementById("canv");
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    };

    tick(): void {
        let i;
        let d;
        let n = this.nodes.length;

        for (i = 1; i < n; ++i) {
            d = this.nodes[i];

            if (d.isIncreasing && !d.isTranslating) {
                this.increaseRadius(d);
            }
            else if (d.isDecreasing && !d.isTranslating) {
                this.decreaseRadius(d);
            }

            if (d.isTranslating) {
                this.translateBubble(d);
            }

                this.collide();
        }

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "white";

        for (i = 1; i < n; i++) {
            this.context.beginPath();
            d = this.nodes[i];
            if (d.isFixed) {
                d.x = this.displayPoint.x;
                d.y = this.displayPoint.y;
            }

            this.context.moveTo(d.x, d.y);
            this.context.arc(d.x, d.y, d.radius - 4, 0, 2 * Math.PI);
            this.context.fill();
            this.context.save();

            this.context.arc(d.x, d.y, IMAGE_SIZE / 2 - 2, 0, Math.PI * 2, false);
            this.context.clip();
            this.context.drawImage(d.image, d.x - IMAGE_SIZE / 2, d.y - IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
            this.context.restore();
            this.context.closePath();
        }

        this.force.resume();
    };
};
