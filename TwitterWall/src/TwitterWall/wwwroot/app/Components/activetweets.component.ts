import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";


@Component({
    selector: "active-tweets",
    template: `
            <table class="table">
              <tbody>
              <tr>
                <th>Body</th>
                <th>Name</th>
                <th>Handle</th>
                <th>Date</th>
                <th>Profile Image</th>
                <th>Attached Images</th>
                <th>Sticky</th>
                <th>Remove</th>
              </tr>
              <tr *ngFor="let tweet of activeTweets; let i=index">
                <td class="body-row">
                    {{tweet.Body}}
                </td>
                <td>
                    {{tweet.Name}}
                </td>
                <td>
                    {{tweet.Handle}}
                </td>
                <td>
                    {{tweet.Date}}
                </td>
                <td>
                    <img class="profile-image" src="{{tweet.ProfileImage}}"/>
                </td>
                <td>
                    <div class="images-container">
                        <img (click)="removeImage(i, imgIndex, img.Id)" class="small-img" *ngFor="let img of tweet.MediaList; let imgIndex=index" src="{{img.Url}}"/>
                    </div>
                </td>
                <td>
                    <input type="checkbox" [attr.checked]="tweet.StickyList.length > 0 ? true : null" (click)=sticky(i,$event)>
                </td>
                <td>
                    <button type="button" (click)="removeTweet(i)">Remove</button>
                </td>
              </tr>
              </tbody>
            </table>
        `
})
export class ActiveTweets {
    activeTweets: Tweet[] = [];
    constructor(private tweetStream: TweetStream) {
        this.activeTweets = this.tweetStream.getActiveTweets();
        this.tweetStream.activeQueueEvent$.subscribe((tweets) => {
            this.activeTweets = tweets;
        });
    }

    removeTweet(index: number): void {
        this.tweetStream.removeActiveTweetFromDB(this.activeTweets[index]);
    }

    addTweet(tweet: Tweet): void {
        this.tweetStream.addActiveTweet(tweet);
    }

    sticky(index: number, event: any): void {
        if (event.target.checked) {
            this.tweetStream.addSticky(this.activeTweets[index].Id);
        }
        else {
            this.tweetStream.removeSticky(this.activeTweets[index].Id);
        }
    }

    removeImage(tweetIndex: number, imageIndex: number, imageId: number): void {
        this.tweetStream.removeTweetImage(tweetIndex, imageIndex, imageId);
    }
}
