import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./Components/app.component";
import { TweetStream } from "./Services/tweetstream.service";
import { BubbleComponent } from "./Components/bubble.component";
import { TweetDisplay } from "./Components/tweetdisplay.component";
import { TweetStreamMock } from "./Services/tweetstream.service.mock";
import { HttpModule } from "@angular/http";
import { AdminPanelComponent } from "./Components/panel.component";
import { RouterModule }   from "@angular/router";
import { BufferTweets } from "./Components/buffertweets.component";
import { ActiveTweets } from "./Components/activetweets.component";

@NgModule({
    imports: [BrowserModule, HttpModule, RouterModule.forRoot([
            { path: "", component: BubbleComponent },
            { path: "admin", component: AdminPanelComponent }
        ])
    ],
    declarations: [AppComponent, BubbleComponent, TweetDisplay, AdminPanelComponent, BufferTweets, ActiveTweets],
    providers: [TweetStream, TweetStreamMock],
    bootstrap: [AppComponent]
})
export class AppModule { }
