import { TestBed } from "@angular/core/testing";
import { Queue } from "../Models/queue";
import { Tweet } from "../Models/tweet";

describe("Queue class tests", () => {

    let infiniteQueue: Queue;
    let finiteQueue: Queue;
    let tweet1: Tweet;
    let tweet2: Tweet;

    beforeEach(() => {
        this.infiniteQueue = new Queue(0);
        this.finiteQueue = new Queue(1);
        this.tweet1 = new Tweet(1, 23232, "Hello World", "Jesus", new Date(), "Jesus Christ", "https://www.heaven.clouds");
        this.tweet2 = new Tweet(2, 343454, "Hello Mars", "Satan", new Date(), "Lucifer", "https://www.hell.underground");
    });

    it("Infinite Queue should push tweet", () => {
        this.infiniteQueue.push(this.tweet1);
        this.infiniteQueue.push(this.tweet2);
        expect(this.infiniteQueue.getLength()).toBe(2);
    });

    it("Finite queue should not push tweet", () => {
        this.finiteQueue.push(this.tweet1);
        this.finiteQueue.push(this.tweet2);
        expect(this.finiteQueue.getLength()).toBe(1);
    });

});
