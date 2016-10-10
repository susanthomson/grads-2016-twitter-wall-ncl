import { ViewChild, Component } from "@angular/core";
import { QueueService } from "../queue.service";
import { Tweet } from "../tweet";
import { ActiveTweets} from "./activetweets.component";
import { BufferTweets} from "./buffertweets.component";

@Component({
    selector: "admin-panel",
    template: `
        <h3>Admin Console</h3>
        <active-tweets></active-tweets>
        <button type="button" (click)="consumeTweet()">Consume tweet!</button>
        <buffer-tweets></buffer-tweets>
        `
})
export class AdminPanelComponent {
    @ViewChild(ActiveTweets) activeTweets: ActiveTweets
    @ViewChild(BufferTweets) bufferTweets: BufferTweets
    constructor() {
        
    }
        
    consumeTweet(): void {
        var tweet = this.bufferTweets.consume();
        if (tweet) {
            this.activeTweets.addTweet(tweet);
        }
    }
}
