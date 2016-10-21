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
import { Subscriptions } from "./Components/subscriptions.component";
import { BannedUsers } from "./Components/bannedusers.component";
import { FormsModule } from "@angular/forms";
import { TwitterLogin } from "./Services/twitterlogin.service";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot([
            { path: "", component: BubbleComponent },
            { path: "admin", component: AdminPanelComponent }
        ])
    ],
    declarations: [AppComponent, BubbleComponent, TweetDisplay, AdminPanelComponent, BufferTweets, ActiveTweets, Subscriptions, BannedUsers],
    providers: [TweetStream, TweetStreamMock, TwitterLogin],
    bootstrap: [AppComponent]
})
export class AppModule { }
