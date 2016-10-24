import { Component } from "@angular/core";
import { Tweet } from "../Models/tweet";
import { TweetStream } from "../Services/tweetstream.service";
import * as moment from 'moment';

@Component({
    selector: "active-tweets",
    template: `
        <div class="table-responsive">
            <table class="table table-condensed">
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
                <th>Ban User</th>
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
                    {{tweet.FormattedDate}}
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
                    <input type="checkbox" [attr.checked]="isSticky(i) ? true : null" (click)=sticky(i,$event)>
                </td>
                <td>
                    <button type="button" class="btn btn-warning" (click)="removeTweet(i)">Remove Tweet</button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" (click)="this.banUser(tweet)">Ban user</button>
                </td>
              </tr>
              </tbody>
            </table>
        </div>
        `
})
export class ActiveTweets {
    activeTweets: Tweet[] = [];
    constructor(private tweetStream: TweetStream) {
        this.activeTweets = this.tweetStream.getActiveTweets().map(this.mapTweet);
        this.tweetStream.activeQueueEvent$.subscribe((tweets) => {
            this.activeTweets = tweets.map(this.mapTweet);
        });
    }

    mapTweet(tweet: Tweet): Tweet {
        return Object.assign(tweet,
        {
            FormattedDate: moment(tweet.Date).format('Do MMM, h:mm a')
        });
    }

    isSticky(index: number): boolean {
        if (this.activeTweets[index].StickyList) {
            return this.activeTweets[index].StickyList.length > 0;
        }
        return false;
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

    banUser(tweet) {
        this.tweetStream.banUser(tweet);
    }
}
