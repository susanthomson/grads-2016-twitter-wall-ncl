import { Component } from "@angular/core";
import { TweetStream } from "./tweetstream.service";


@Component({
    selector: "twitter-card",
    template: `<h1>A twitter card.....</h1>`

})
export class TwitterCard {
    private tweets: Array<Tweet>;

    constructor() {

    }


}
