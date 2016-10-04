"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var vector_1 = require("./vector");
var d3 = require("d3");
var MAX_NODES = 20;
var MIN_NODES = 10;
var MAX_RADIUS = 400;
var MIN_RADIUS = 100;
var INCREASE_STEP = 2;
var IMAGE_SIZE = 200;
var TIME_BETWEEN_EXPAND = 2000;
var TIME_TO_SHOW = 5000;
var TRANSLATION_TICKS = 100;
var GRAVITY = 0.01;
var BubbleComponent = (function () {
    function BubbleComponent() {
        var _this = this;
        this.translationPoint = 0;
        this.points = [];
        // Use only until tweets are implemented
        this.images = [];
        this.imageNumber = 0;
        // Test images only, will be replaced with tweet avatar url
        this.urls = [
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
        this.urls.forEach(function (url) {
            _this.images.push(_this.preLoadImage(url));
        });
    }
    ;
    BubbleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.width = 1900;
        this.height = 800;
        this.displayPoint = new vector_1.Vector(this.width / 2, this.height / 2);
        this.generateCanvas();
        this.populateNodes();
        this.setupForce();
        setInterval(function () {
            if (!_this.nodes.every(function (n) { return !n.isDisplayed; })) {
                return;
            }
            var i = Math.round((Math.random() * _this.nodes.length - 2)) + 1;
            _this.points = _this.generateTranslation(new vector_1.Vector(_this.nodes[i].x, _this.nodes[i].y), _this.displayPoint, TRANSLATION_TICKS);
            _this.nodes[i].isTranslating = true;
        }, TIME_BETWEEN_EXPAND);
        this.force.on("tick", this.tick.bind(this));
    };
    ;
    BubbleComponent.prototype.preLoadImage = function (url) {
        var img = new Image();
        img.src = url;
        return img;
    };
    ;
    BubbleComponent.prototype.generateCanvas = function () {
        var canvas = d3.select("#bubble-canvas").append("canvas")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("id", "canv")
            .attr("style", "background: black;");
        this.context = canvas.node().getContext("2d");
    };
    ;
    BubbleComponent.prototype.populateNodes = function () {
        var _this = this;
        this.nodes = d3.range(MIN_NODES).map(function (d, i) { return ({
            radius: MIN_RADIUS,
            image: _this.images[i % _this.urls.length],
            isDisplayed: false,
            isTranslating: false,
            isIncreasing: false,
            isDecreasing: false
        }); }),
            this.root = this.nodes[0];
        this.root.radius = 0;
        this.root.fixed = true;
    };
    ;
    BubbleComponent.prototype.setupForce = function () {
        this.force = d3.layout.force()
            .gravity(GRAVITY)
            .nodes(this.nodes)
            .size([this.width, this.height]);
        this.force.start();
    };
    ;
    BubbleComponent.prototype.translateBubble = function (node) {
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
    ;
    BubbleComponent.prototype.generateTranslation = function (p1, p2, frames) {
        if (p1.x === p2.x && p1.y === p2.y) {
            return;
        }
        // Need to add extra step for last position
        frames = frames - 1;
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var incrementX = dx / frames;
        var incrementY = dy / frames;
        var a = new Array();
        a.push(p1);
        for (var frame = 0; frame < frames - 1; frame++) {
            a.push(new vector_1.Vector(p1.x + (incrementX * frame), p1.y + (incrementY * frame)));
        }
        a.push(p2);
        return (a);
    };
    ;
    BubbleComponent.prototype.increaseRadius = function (node) {
        if (node.radius >= MAX_RADIUS) {
            node.isIncreasing = false;
            setTimeout(function () {
                node.isDecreasing = true;
            }, TIME_TO_SHOW);
            return;
        }
        node.isDisplayed = true;
        node.isFixed = true;
        node.radius += INCREASE_STEP;
    };
    ;
    BubbleComponent.prototype.decreaseRadius = function (node) {
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
    ;
    BubbleComponent.prototype.collide = function () {
        for (var i = 1; i < this.nodes.length; i++) {
            for (var j = i + 1; j < this.nodes.length; j++) {
                var node = this.nodes[i];
                var node2 = this.nodes[j];
                var node1Pos = new vector_1.Vector(node.x, node.y);
                var node2Pos = new vector_1.Vector(node2.x, node2.y);
                var nodeDistance = Math.sqrt((node1Pos.x - node2Pos.x) * (node1Pos.x - node2Pos.x) + (node1Pos.y - node2Pos.y) * (node1Pos.y - node2Pos.y));
                if (nodeDistance < node.radius + node2.radius) {
                    // Collision happened
                    var pen = node.radius + node2.radius - nodeDistance;
                    var collision = node1Pos.subtract(node2Pos);
                    var norm = collision.divide(nodeDistance);
                    this.nodes[i].x = node.x + (norm.x * (pen / 2));
                    this.nodes[i].y = node.y + (norm.y * (pen / 2));
                    this.nodes[j].x = node2.x - (norm.x * (pen / 2));
                    this.nodes[j].y = node2.y - (norm.y * (pen / 2));
                }
            }
        }
    };
    ;
    BubbleComponent.prototype.addNode = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (this.nodes.length < MAX_NODES) {
            this.nodes.push({ x: x, y: y, image: this.images[this.imageNumber], radius: MIN_RADIUS });
            this.imageNumber = (this.imageNumber + 1) % this.images.length;
            this.force.start();
        }
    };
    ;
    BubbleComponent.prototype.removeNode = function (index) {
        if (!this.nodes[index].isDisplayed && this.nodes.length > MIN_NODES && index !== 0) {
            this.nodes.splice(index, 1);
            this.force.resume();
        }
    };
    ;
    BubbleComponent.prototype.removeTest = function () {
        var i = Math.round(Math.random() * this.nodes.length - 2) + 1;
        this.removeNode(i);
    };
    ;
    BubbleComponent.prototype.goFullScreen = function () {
        // Can't use ViewChild here because canvas is generated dynamically by d3
        var elem = document.getElementById("canv");
        if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    };
    ;
    BubbleComponent.prototype.tick = function () {
        var i;
        var d;
        var n = this.nodes.length;
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
    ;
    BubbleComponent = __decorate([
        core_1.Component({
            selector: "bubble-canvas",
            template: "\n        <button (click)=\"goFullScreen()\">Fullscreen</button>\n        <button (click)=\"removeTest()\">Remove 1</button>\n        <div id=\"bubble-canvas\" (click)=\"addNode()\"></div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], BubbleComponent);
    return BubbleComponent;
}());
exports.BubbleComponent = BubbleComponent;
;
//# sourceMappingURL=bubble.component.js.map