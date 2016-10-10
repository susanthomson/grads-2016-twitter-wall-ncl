import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { TweetStream } from "./tweetstream.service";
import { BubbleComponent } from "./bubble.component";
import { TweetDisplay } from "./tweetdisplay.component";
import { TweetStreamMock } from "./tweetstream.service.mock";
import { AdminPanelComponent } from "./console/panel.component";
import { RouterModule }   from "@angular/router";
import { BufferTweets } from "./console/buffertweets.component";
import { ActiveTweets } from "./console/activetweets.component";


@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            { path: "", component: BubbleComponent },
            { path: "admin", component: AdminPanelComponent }
        ])
    ],
    declarations: [AppComponent, TwitterCard, BubbleComponent, TweetDisplay, AdminPanelComponent, BufferTweets, ActiveTweets],
    providers: [TweetStream, TweetStreamMock],
    bootstrap: [AppComponent]
})
export class AppModule { }
