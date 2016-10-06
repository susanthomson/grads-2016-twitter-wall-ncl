import { TestBed } from "@angular/core/testing";

describe("Queue service tests", () => {

    var fixture;
    var component;

    beforeEach(() => {

        component = {};
        fixture = {};

    });

    it("should not allow more tweets than max set", () => {
        fixture.detectChanges();
        component.tweetStream.pushTweets();
        expect(component.tweets.length).toBe(2);
    });

});