import { Component, OnInit, OnDestroy } from "@angular/core";
import { Vector } from "../Models/vector";
import { TweetDisplay } from "./tweetdisplay.component";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";
import { Router } from "@angular/router";
import * as d3 from "d3";
import { NodeFunctions } from "../Models/nodefunctions";
import BezierEasing from "../Helpers/bezier-easing";

const TIME_BETWEEN_EXPAND = 2000;
const TIME_TO_SHOW = 5000;
const TRANSLATION_TICKS = 100;
const GRAVITY = 0.009;
const DEFAULT_IMAGE = "https://pbs.twimg.com/media/CLIz5A9VAAAcbNe.png";
const GROW_TIME = 3400;
const TRANSLATE_TIME = 5000;
const EXIT_TIME = 2000;

@Component({
    selector: "bubble-canvas",
    template: `
        <div id="bubble-canvas" [class.fullscreen]="fullScreen">
            <div tweet-display [tweet]="currentTweet" id="tweet-display"
                [bubbleSize]="radius"
                [maxBubbleSize]="displayRadius"
                [showTweet]="showTweet">
            </div>
            <div id="brand">
                <img src='/img/bristech-black.png' />
                <span>#bristech2016</span>
            <div>
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
    displayPoint: Vector;
    showTweet = false;
    currentTweet: Tweet = new Tweet(1, 1, "", "", new Date(), "", "", [], []);

    displayRadius: number = 400;
    radius: number = 100;
    exitStartTime: number;

    displayCount: number = 0;

    constructor(private tweetStream: TweetStream, private router: Router) {

    };

    ngOnInit(): void {
        let initialTweets = this.tweetStream.getActiveTweets();
        this.populateNodes(initialTweets);
        this.generateCanvas();
        this.setupForce();
        this.onResize();

        this.tweetStream.activeQueueEvent$.subscribe(this.activeTweetsChanged.bind(this));

        this.force.on("tick", this.tick.bind(this));
        this.nodeDisplayInterval();

        window.onresize = () => this.onResize();
    };

    onResize(): void {
        this.width = document.body.offsetWidth;
        this.height = document.body.offsetHeight;
        this.displayPoint = new Vector(this.width / 2, this.height / 2);
        d3.select("canvas")
            .attr("width", this.width)
            .attr("height", this.height);
        this.force.size([this.width, this.height]);

        this.displayRadius = this.width < this.height ? this.width * 0.4 : this.height * 0.4;
        this.radius = this.displayRadius / 4;
        this.nodes.forEach((node) => {
            if (!node.isDisplayed) {
                node.radius = this.radius;
                node.opacity = 0;
            }
        });

        let td = document.getElementById("tweet-display-group");
        let canv = document.getElementsByTagName("canvas")[0];

        let usernameElem = document.getElementById("username");
        let nameElem = document.getElementById("name");
        let bodyElem = document.getElementById("tweet-body");
        let timeElem = document.getElementById("timestamp");
        let imageElem = document.getElementById("profile-image-bubble");
        let twitterLogoElem = document.getElementById("twitter-logo");

        td.style.width = (this.displayRadius * 2) + "px";
        td.style.height = (this.displayRadius * 2) + "px";
        twitterLogoElem.style.width = (this.displayRadius * 2) / 20 + "px";
        twitterLogoElem.style.height = (this.displayRadius * 2) / 24.6 + "px";
        imageElem.style.width = (this.displayRadius * 2) / 10 + "px";
        imageElem.style.height = (this.displayRadius * 2) / 10 + "px";

        usernameElem.style.fontSize = (this.displayRadius * 2) / 44 + "px";
        nameElem.style.fontSize = (this.displayRadius * 2) / 36 + "px";
        bodyElem.style.fontSize = (this.displayRadius * 2) / 30 + "px";
        timeElem.style.fontSize = (this.displayRadius * 2) / 44 + "px";

        bodyElem.style.maxWidth = (this.displayRadius * 1.25) + "px";
    }

    ngOnDestroy(): void {
        this.force.stop();
        this.force = null;
        clearTimeout(this.displayTimer);
        this.nodes = null;
    }

    nodeDisplayInterval(): void {
        this.displayTimer = setTimeout(() => {
            this.displayNode();
            if (this.router.url === "/") {
                this.nodeDisplayInterval();
            }
        }, TIME_BETWEEN_EXPAND);
    }

    activeTweetsChanged(activeTweets): void {
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
        if (this.router.url === "/" && this.nodes.every(n => !n.isDisplayed && !n.isTranslating) && this.nodes && this.nodes.length) {
            let i = this.displayCount % this.nodes.length;
            this.nodes[i].isTranslating = true;
            this.currentTweet = this.nodes[i].tweet;
            this.displayCount = (this.displayCount + 1) % this.nodes.length;
            this.nodes[i].translateStartTime = Date.now();
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
        const canvas = d3
            .select("#bubble-canvas")
            .insert("canvas", ":first-child")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", "canv")
            .attr("style", "background: rgba(0,0,0,0);");

        this.context = (canvas as any).node().getContext("2d");
    };

    populateNodes(tweets): void {
        this.nodes = d3.range(tweets.length).map((d, i) => ({
                radius: this.radius,
                tweet: tweets[i],
                isDisplayed: false,
                isTranslating: false,
                isIncreasing: false,
                isDecreasing: false,
                isDeleting: false,
                scaleStartTime: 0,
                translateStartTime: 0,
                exitStartTime: 0,
                opacity: 0
            }));
    };

    setupForce(): void {
        this.force = d3.layout.force()
            .gravity(GRAVITY)
            .friction(0.85)
            .charge(-80)
            .nodes(this.nodes)
            .size([this.width, this.height]);
        this.force.start();
    };

    translateBubble(node: any): void {
        const SNAP_DISTANCE = 10;
        const GROW_ZONE = 600;

        if (Math.abs(Math.round(node.x - this.displayPoint.x)) <= SNAP_DISTANCE &&
            Math.abs(Math.round(node.y - this.displayPoint.y)) <= SNAP_DISTANCE
        ) {
            node.isTranslating = false;
            node.isDisplayed = true;
            node.isIncreasing = true;
            node.isFixed = true;
            // node.scaleStartTime = Date.now();
        }
        else {
            let valueX = this.easeOut(Date.now() - node.translateStartTime, node.x, this.displayPoint.x - node.x, TRANSLATE_TIME);
            let valueY = this.easeOut(Date.now() - node.translateStartTime, node.y, this.displayPoint.y - node.y, TRANSLATE_TIME);

            node.x = valueX;
            node.y = valueY;
        }

        if (!node.isIncreasing && Math.abs(Math.round(node.x - this.displayPoint.x)) < GROW_ZONE &&
            Math.abs(Math.round(node.y - this.displayPoint.y)) < GROW_ZONE
        ) {
            node.isDisplayed = true;
            node.isIncreasing = true;
            node.scaleStartTime = Date.now();
        }
    };

    addNode(x: number = 0, y: number = 0, tweet: Tweet): void {
        if (tweet !== undefined && !this.nodes.find(t => t.tweet.Id === tweet.Id)) {
            tweet.LoadedProfileImage = this.preLoadImage(tweet.ProfileImage);
            this.nodes.push({
                x: x,
                y: y,
                tweet: tweet,
                radius: this.radius,
                scaleStartTime: 0,
                translateStartTime: 0,
                exitStartTime: 0,
                opacity: 0
            });
            this.force.start();
        }
    };

    removeNode(index: number): void {
        const node = this.nodes[index];
        if (node && !node.isDeleting) {
            if (!node.isDisplayed && !node.isTranslating) {
                node.exitStartTime = Date.now();
                node.isDeleting = true;
            }
            else {
                node.toBeDeleted = true;
            }
        }
    };

    private deleteNode(index: number): void {
        this.nodes.splice(index, 1);
        this.force.resume();
    };

    private easeOut(t, b, c, d) {
        const ease = BezierEasing(0.75, 0.045, 0.25, 1);
        const y = ease(t / d);
        return Math.round((c * y) + b);
    };

    private cubicEaseOut(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    tick(): void {
        let i;
        let d;
        let n = this.nodes.length;

        for (i = 0; i < n; ++i) {
            d = this.nodes[i];

            if (d.isIncreasing) {
                let value = this.easeOut(Date.now() - d.scaleStartTime, this.radius, this.displayRadius - this.radius, GROW_TIME);
                let rad = Math.min(value, this.displayRadius);
                NodeFunctions.increaseRadius(d, this.displayRadius, rad, TIME_TO_SHOW, this);
                d.opacity = (rad - this.radius) / (this.displayRadius - this.radius);
            }
            else if (d.isDecreasing && !d.isTranslating) {
                let value = this.easeOut(Date.now() - d.scaleStartTime, this.radius, this.displayRadius - this.radius, GROW_TIME);
                let rad = this.displayRadius + this.radius - Math.max(value, this.radius);
                NodeFunctions.decreaseRadius(d, this.radius, rad, this);
                d.opacity = (rad - this.radius) / (this.displayRadius - this.radius);
            }

            if (d.isTranslating) {
                this.translateBubble(d);
            }

            if (d.isDeleting) {
                let value = this.easeOut(Date.now() - d.exitStartTime, 0, this.radius, EXIT_TIME);
                let rad = this.radius - Math.max(value, 0);
                NodeFunctions.decreaseRadius(d, 1, rad, this);
                if (d.radius < 1) {
                    d.deleted = true;
                }
            }

            if (d.toBeDeleted && !d.isDisplayed && !d.isDeleting) {
                this.removeNode(d.index);
            }

            NodeFunctions.collide(this.nodes);
        }

        this.context.clearRect(0, 0, this.width, this.height);

        for (i = 0; i < n; i++) {
            this.context.beginPath();
            d = this.nodes[i];
            if (d.radius < 5) {
                continue;
            }
            const shadowOffset = 0.1;
            const shadowScale = 1.5;
            const gradient = this.context.createRadialGradient(
                d.x - (d.radius * shadowOffset), d.y + (d.radius * shadowOffset), d.radius * shadowScale,
                d.x - (d.radius * shadowOffset), d.y + (d.radius * shadowOffset), 0
            );
            gradient.addColorStop(0, "rgba(250, 250, 250, 0)");
            gradient.addColorStop(0.4, "rgba(150, 150, 150, 0.7)");
            this.context.fillStyle = gradient;
            this.context.moveTo(d.x, d.y);
            this.context.arc(d.x - shadowOffset, d.y + shadowOffset, d.radius * shadowScale, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        }


        for (i = 0; i < n; i++) {
            d = this.nodes[i];
            this.context.fillStyle = "rgba(250, 250, 250, " + d.opacity + ")";
            this.context.beginPath();

            if (d.radius < 5) {
                continue;
            }
            if (d.isFixed) {
                d.x = this.displayPoint.x;
                d.y = this.displayPoint.y;
            }

            this.context.moveTo(d.x, d.y);
            this.context.save();
            this.context.arc(d.x, d.y, d.radius, 0, Math.PI * 2, false);
            this.context.clip();
            try {
                this.context.drawImage(d.tweet.LoadedProfileImage, d.x - d.radius, d.y - d.radius, d.radius * 2, d.radius * 2);
            } catch (err) {
                d.tweet.LoadedProfileImage = this.preLoadImage(d.tweet.ProfileImage);
            }

            this.context.restore();
            this.context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
            this.context.fill();
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
