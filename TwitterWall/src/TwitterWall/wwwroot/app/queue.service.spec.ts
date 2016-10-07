import { TestBed } from "@angular/core/testing";
import { QueueService } from "./queue.service";
import { TweetStreamMock } from "./tweetstream.service.mock";
import { Tweet } from "./tweet";

describe("Queue service tests", () => {

    let queueService;
    let tweetStreamMock;

    beforeEach(() => {
        this.tweetStreamMock = new TweetStreamMock();
        this.queueService = new QueueService(this.tweetStreamMock, 20);
    });

    it("queue should return initial tweets", () => {
        this.tweetStreamMock.pushTweets();
        expect(this.queueService.getQueue().getLength()).toBe(2);
    });

    it("queue should return last tweet", () => {
        this.tweetStreamMock.pushTweets();
        expect(this.queueService.getSingleTweet().Id).toBe(2);
    });
});