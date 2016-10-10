import { Injectable } from "@angular/core";
import { Tweet } from "../Models/tweet";

@Injectable()
export class QueueServiceMock {
    public getSingleTweet() {
        return new Tweet(1, 1, "body", "handle", new Date(), "name", "url");
    }

    // Fake the promise by returning this and implementing a then method
    public getInitialTweets() {
        return this;
    }

    public then(callback) {
        callback([new Tweet(1, 1, "body", "handle", new Date(), "name", "url")]);
    }
};
