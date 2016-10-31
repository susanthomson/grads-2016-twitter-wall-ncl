import { Component } from "@angular/core";
import { TweetStream } from "../Services/tweetstream.service";
import { Tweet } from "../Models/tweet";

@Component({
    selector: "banned-users",
    template: `
        <div class="panel panel-danger">
            <div class="panel-heading">
             Banned users
            </div>
            <ul class="list-group">
                <li class="list-group-item" *ngIf="bannedUsers.length === 0">No users have yet been banned.</li>
                <li class="list-group-item" *ngFor="let user of bannedUsers; let i=index">
                    {{user.Handle}}
                    <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="unbanUser(user.Id)"></span>
                </li>
            </ul>
        </div>
        `
})
export class BannedUsers {
    bannedUsers: Array<any>;

    constructor(private tweetStream: TweetStream) {
        this.bannedUsers = [];
        this.tweetStream.bannedUsersReceived$.subscribe((users) => {
            this.bannedUsers = users;
        });
        this.tweetStream.getBannedUsers();
    }

    banUser(tweet: Tweet) {
        this.tweetStream.banUser(tweet);
    }

    unbanUser(id: number) {
        this.tweetStream.removeBannedUser(id);
    }
}
