import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { TweetStream } from "./tweetstream.service";
import { BubbleComponent } from "./bubble.component";
import { TweetDisplay } from "./tweetdisplay.component";

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, TwitterCard, BubbleComponent, TweetDisplay],
    providers: [TweetStream],
    bootstrap: [AppComponent]
})
export class AppModule { }
