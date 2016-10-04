import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { TweetStream } from "./tweetstream.service";
import { BubbleComponent } from "./bubble.component";

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, TwitterCard, BubbleComponent],
    providers: [TweetStream],
    bootstrap: [AppComponent]
})
export class AppModule { }
