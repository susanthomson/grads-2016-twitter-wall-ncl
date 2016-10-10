import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./Components/app.component";
import { TwitterCard } from "./Components/twittercard.component";
import { TweetStream } from "./Services/tweetstream.service";
import { BubbleComponent } from "./Components/bubble.component";
import { TweetDisplay } from "./Components/tweetdisplay.component";
import { TweetStreamMock } from "./Services/tweetstream.service.mock";
import { QueueService } from "./Services/queue.service";
import { HttpModule } from "@angular/http";
import { AdminPanelComponent } from "./console/panel.component";
import { RouterModule }   from "@angular/router";
import { BufferTweets } from "./console/buffertweets.component";
import { ActiveTweets } from "./console/activetweets.component";

@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule.forRoot([
            { path: "", component: BubbleComponent },
            { path: "admin", component: AdminPanelComponent }
        ])
    ],
    declarations: [AppComponent, TwitterCard, BubbleComponent, TweetDisplay, AdminPanelComponent, BufferTweets, ActiveTweets],
    providers: [TweetStream, TweetStreamMock, QueueService],
    bootstrap: [AppComponent]
})
export class AppModule { }
