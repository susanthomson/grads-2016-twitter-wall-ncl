import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent }   from "./app.component";
import { TwitterCard } from "./twittercard.component";
import { TweetStream } from "./tweetstream.service";

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, TwitterCard],
    providers: [TweetStream],
    bootstrap: [AppComponent]
})
export class AppModule { }