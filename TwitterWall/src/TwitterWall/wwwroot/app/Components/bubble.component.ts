import { Component, OnInit } from "@angular/core";
import { Vector } from "../Models/vector";
import { TweetDisplay } from "./tweetdisplay.component";
import { Tweet } from "../Models/tweet";
import { QueueService } from "../Services/queue.service";
import * as d3 from "d3";

import { NodeFunctions } from "../Models/nodefunctions";

const MAX_NODES = 20;
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
        <div id="bubble-canvas" [class.fullscreen]="fullScreen">
            <div tweet-display [tweet]="currentTweet" style="position: absolute;" id="tweet-display" class="step" [class.show]="showTweet"></div>
        </div>
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
    showTweet = false;
    currentTweet: Tweet = new Tweet(1, 1, "", "", new Date(), "", "");

    constructor(private queueService: QueueService) {
    };

    ngOnInit(): void {
        this.width = window.innerWidth;
        this.height = 900;
        this.displayPoint = new Vector(this.width / 2, this.height / 2);

        let initialTweets: Tweet[] = [];
        this.queueService.getInitialTweets().then((tweets) => {
            tweets = tweets.slice(-10);
            tweets.forEach((tweet) => {
                tweet.LoadedProfileImage = this.preLoadImage(tweet.ProfileImage);
                initialTweets.push(tweet);
            });
            this.populateNodes(initialTweets);
            this.generateCanvas();
            this.setupForce();
            // Center div in canvas
            let td = document.getElementById("tweet-display-group");
            let canv = document.getElementsByTagName("canvas")[0];
            td.style.left = ((canv.offsetLeft + (canv.width / 2)) - (td.offsetWidth / 2)) + "px";
            td.style.top = (((canv.height / 2)) - (td.offsetHeight / 2)) + "px";
            this.force.on("tick", this.tick.bind(this));
        });

        setInterval(this.displayRandomNode.bind(this), TIME_BETWEEN_EXPAND);

        setInterval(this.getLatestTweet.bind(this), 5000);

    };

    getLatestTweet(): void {
        let tweet = this.queueService.getSingleTweet();
        if (tweet !== undefined) {
            this.addNode(0, 0, tweet);
        }
    }

    displayRandomNode(): void {
        if (!this.nodes || !this.nodes.every(n => !n.isDisplayed) || this.nodes.length === 0) {
            return;
        }

        let i = Math.round((Math.random() * this.nodes.length - 2)) + 1;
        this.displayNode(i);
    }

    displayNode(i): void {
        this.points = NodeFunctions.generateTranslation(new Vector(this.nodes[i].x, this.nodes[i].y), this.displayPoint, TRANSLATION_TICKS);
        this.nodes[i].isTranslating = true;
        this.currentTweet = this.nodes[i].tweet;
    }

    preLoadImage(url: string): HTMLImageElement {
        let img = new Image();
        img.src = url;
        return img;
    };

    generateCanvas(): void {
        const canvas = d3.select("#bubble-canvas").insert("canvas", ":first-child")
                        .attr("width", this.width)
                        .attr("height", this.height)
                        .attr("id", "canv")
                        .attr("style", "background: black;");

        this.context = (canvas as any).node().getContext("2d");
    };

    populateNodes(tweets): void {
        this.nodes = d3.range(tweets.length).map((d, i) => ({
                radius: MIN_RADIUS,
                tweet: tweets[i],
                isDisplayed: false,
                isTranslating: false,
                isIncreasing: false,
                isDecreasing: false
            }));
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

    addNode(x: number = 0, y: number = 0, tweet: Tweet): void {
        if (this.nodes.length < MAX_NODES && tweet !== undefined && !this.nodes.find(t => t.tweet.Id === tweet.Id)) {
            tweet.LoadedProfileImage = this.preLoadImage(tweet.ProfileImage);
            this.nodes.push({x: x, y: y, tweet: tweet, radius: MIN_RADIUS});
            this.force.start();
        }
    };

    removeNode(index: number): void {
        if (this.nodes.length > 0 && !this.nodes[index].isDisplayed) {
            this.nodes.splice(index, 1);
            this.force.resume();
        }
    };

    tick(): void {
        let i;
        let d;
        let n = this.nodes.length;

        for (i = 0; i < n; ++i) {
            d = this.nodes[i];

            if (d.isIncreasing && !d.isTranslating) {
                NodeFunctions.increaseRadius(d, MAX_RADIUS, INCREASE_STEP, TIME_TO_SHOW, this);
            }
            else if (d.isDecreasing && !d.isTranslating) {
                NodeFunctions.decreaseRadius(d, MIN_RADIUS, INCREASE_STEP, this);
            }

            if (d.isTranslating) {
                this.translateBubble(d);
            }

            NodeFunctions.collide(this.nodes);
        }

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "white";

        for (i = 0; i < n; i++) {
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
            this.context.drawImage(d.tweet.LoadedProfileImage, d.x - IMAGE_SIZE / 2, d.y - IMAGE_SIZE / 2, IMAGE_SIZE, IMAGE_SIZE);
            this.context.restore();
            this.context.closePath();
        }

        this.force.resume();
    };
};
