import { Component, OnInit, OnDestroy } from "@angular/core";
import { Vector } from "../Models/vector";
import { TweetDisplay } from "./tweetdisplay.component";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
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
const DEFAULT_IMAGE = "https://pbs.twimg.com/media/CLIz5A9VAAAcbNe.png";

@Component({
    selector: "bubble-canvas",
    template: `
        <div id="bubble-canvas" [class.fullscreen]="fullScreen">
            <div tweet-display [tweet]="currentTweet" id="tweet-display" class="step" [class.show]="showTweet"></div>
            <p id="get-involved-text">Get involved using #Bristech2016</p>
        </div>
    `
})
export class BubbleComponent implements OnInit, OnDestroy {
    context: any;
    width: number;
    height: number;
    nodes: any;
    root: any;
    force: any;
    displayTimer: any;
    translationPoint: number = 0;
    points: Vector[] = [];
    displayPoint: Vector;
    showTweet = false;
    currentTweet: Tweet = new Tweet(1, 1, "", "", new Date(), "", "", [], []);

    displayCount: number = 0;

    eventName: string;

    constructor(private tweetStream: TweetStream, private router: Router, private route: ActivatedRoute) {

    };

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.eventName = params["id"];
        });
        this.tweetStream.setEvent(this.eventName);

        this.width = window.innerWidth;
        this.height = 900;
        this.displayPoint = new Vector(this.width / 2, this.height / 2);

        let initialTweets = this.tweetStream.getActiveTweets();
        this.populateNodes(initialTweets);
        this.generateCanvas();
        this.setupForce();

        this.tweetStream.activeQueueEvent$.subscribe(this.activeTweetsChanged.bind(this));

        // Center div in canvas
        let td = document.getElementById("tweet-display-group");
        let canv = document.getElementsByTagName("canvas")[0];
        td.style.left = ((canv.offsetLeft + (canv.width / 2)) - (td.offsetWidth / 2)) + "px";
        td.style.top = (((canv.height / 2)) - (td.offsetHeight / 2)) + "px";
        this.force.on("tick", this.tick.bind(this));
        this.nodeDisplayInterval();
    };

    ngOnDestroy(): void {
        this.force.stop();
        this.force = null;
        clearTimeout(this.displayTimer);
        this.nodes = null;
    }

    nodeDisplayInterval(): void {
        this.displayTimer = setTimeout(() => {
            this.displayNode();
            if (this.router.url === "/events/" + this.eventName) {
                this.nodeDisplayInterval();
            }
        }, TIME_BETWEEN_EXPAND);
    }

    activeTweetsChanged(activeTweets): void {
        if (!activeTweets || !this.nodes) return;
        if (activeTweets.length - this.nodes.length > 1) {
            activeTweets.forEach((tweet) => {
                this.addNode(0, 0, tweet);
            });
            return;
        }

        if (activeTweets.length >= this.nodes.length) {
            this.addNode(0, 0, activeTweets[activeTweets.length - 1]);
        }
        else {
            let toDelete = this.nodes.filter((node) => {
                return !activeTweets.filter(tweet => node.tweet.Id === tweet.Id).length;
            });

            this.removeNode(this.nodes.indexOf(toDelete[0]));
        }
    }

    displayNode(): void {
        if (this.router.url === "/events/" + this.eventName && this.nodes.every(n => !n.isDisplayed && !n.isTranslating) && this.nodes && this.nodes.length) {
            let i = this.displayCount % this.nodes.length;
            this.points = NodeFunctions.generateTranslation(new Vector(this.nodes[i].x, this.nodes[i].y), this.displayPoint, TRANSLATION_TICKS);
            this.nodes[i].isTranslating = true;
            this.currentTweet = this.nodes[i].tweet;
            this.displayCount = (this.displayCount + 1) % this.nodes.length;
        }
    }

    preLoadImage(url: string): HTMLImageElement {
        let img = new Image();
        img.onerror = () => {
            img.src = DEFAULT_IMAGE;
            return img;
        };
        img.src = url;
        return img;
    };

    generateCanvas(): void {
        const canvas = d3.select("#bubble-canvas").insert("canvas", ":first-child")
                        .attr("width", this.width)
                        .attr("height", this.height)
                        .attr("id", "canv")
                        .attr("style", "background: rgba(0,0,0,0);");

        this.context = (canvas as any).node().getContext("2d");
    };

    populateNodes(tweets): void {
        if (tweets) {
            this.nodes = d3.range(tweets.length).map((d, i) => ({
                radius: MIN_RADIUS,
                tweet: tweets[i],
                isDisplayed: false,
                isTranslating: false,
                isIncreasing: false,
                isDecreasing: false,
                isDeleting: false
            }));
        }
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
        }
        else {
            node.x = this.points[this.translationPoint].x;
            node.y = this.points[this.translationPoint].y;
            this.translationPoint++;
        }
    };

    addNode(x: number = 0, y: number = 0, tweet: Tweet): void {
        if (this.nodes.length < MAX_NODES && tweet !== undefined && !this.nodes.find(t => t.tweet.Id === tweet.Id)) {
            tweet.LoadedProfileImage = this.preLoadImage(tweet.ProfileImage);
            this.nodes.push({x: x, y: y, tweet: tweet, radius: MIN_RADIUS});
            this.force.start();
        }
    };

    removeNode(index: number): void {
        if (index >= 0 && index < this.nodes.length) {
            if (!this.nodes[index].isDisplayed) {
                this.nodes[index].isDeleting = true;
            }
            else {
                this.nodes[index].toBeDeleted = true;
            }
        }
    };

    private deleteNode(index: number): void {
        this.nodes.splice(index, 1);
        this.force.resume();
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

            if (d.isDeleting) {
                NodeFunctions.decreaseRadius(d, 0, INCREASE_STEP, this);
                if (d.radius < 1) {
                    d.deleted = true;
                }
            }

            if (d.toBeDeleted && !d.isDisplayed) {
                d.isDeleting = true;
            }

            NodeFunctions.collide(this.nodes);
        }

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "white";

        for (i = 0; i < n; i++) {
            this.context.beginPath();
            d = this.nodes[i];
            if (d.radius < 5) {
                continue;
            }
            if (d.isFixed) {
                d.x = this.displayPoint.x;
                d.y = this.displayPoint.y;
            }

            this.context.moveTo(d.x, d.y);
            this.context.arc(d.x, d.y, d.radius - 4, 0, 2 * Math.PI);
            this.context.fill();
            this.context.save();
            this.context.arc(d.x, d.y, d.radius - 2, 0, Math.PI * 2, false);
            this.context.clip();
            try {
                this.context.drawImage(d.tweet.LoadedProfileImage, d.x - d.radius, d.y - d.radius, d.radius * 2, d.radius * 2);
            } catch (err) {
                d.tweet.LoadedProfileImage = this.preLoadImage(d.tweet.ProfileImage);
            }
            this.context.restore();
            this.context.closePath();
        }

        for (i = 0; i < n; i++) {
            if (this.nodes[i].deleted) {
                this.deleteNode(i);
                break;
            }
        }

        this.force.resume();
    };
};
