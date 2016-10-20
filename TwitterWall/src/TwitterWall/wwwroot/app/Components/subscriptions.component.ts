import { Component } from "@angular/core";
import { TweetStream } from "../Services/tweetstream.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "subscriptions",
    template: `
        <div class="col-sm-12">
        {{this.errorMessage}}
        <div class="panel panel-warning">
            <div class="panel-heading">Follow a keyword</div>
            <form class="form-inline">
                    <input type="text" class="form-control" name="inputKeyword" maxlength="60" placeholder="Enter keyword to follow" [(ngModel)]="inputTrack" />
                    <button class="btn btn-success btn-sm" type="button" (click)="addTrack()"><span class="glyphicon glyphicon-font" aria-hidden="true"></span> Follow Keyword</button>
            </form>
            <ul class="list-group">
                <li class="list-group-item" *ngIf="tracks.length === 0">You are currently following no keywords.</li>
                <li class="list-group-item" *ngFor="let track of tracks; let i=index">
                    {{ track.Value }}
                    <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTrack(i)"></span>
                </li>
            </ul>
        </div>
        <div class="panel panel-success">
        <div class="panel-heading">Follow a user</div>
        <form class="form-inline">
        <div class="form-group">
            <div class="input-group">
                <input type="text" name="inputUser" class="form-control" placeholder="Username" [(ngModel)]="inputUserId" />
            </div>
        </div>
        <button class="btn btn-primary btn-sm" type="button" (click)="addPriorityUser()"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Follow User</button>
        </form>
        <ul class="list-group">
            <li class="list-group-item" *ngIf="priorityUsers.length === 0">You are currently following no users.</li>
            <li class="list-group-item" *ngFor="let user of priorityUsers; let i=index">

                  <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                  {{ user.Value }}
                  <span class="badge"><span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removePriorityUser(i)"></span></span>
            </li>
        </ul>
        </div>
        <div *ngIf="streamRestart">
            <p>For changes to take place, you must save your changes:</p>
            <button type="button" class="btn btn-danger" (click)="restartStream()">Save changes</button>
        </div>
       </div>

        `
})
export class Subscriptions {
    inputTrack: any;
    inputUserId: any;
    tracks: Array<{ Id: number, Value: string, Type: string }> = [];
    priorityUsers: Array<{ Id: number, Value: string, Type: string }> = [];
    errorMessage: string;
    streamRestart: boolean = false;

    constructor(private tweetStream: TweetStream) {
        this.tweetStream.tracksReceived$.subscribe((keywords) => {
            this.tracks = keywords;
        });
        this.tweetStream.usersReceived$.subscribe((users) => {
            this.priorityUsers = users;
        });
        this.tweetStream.errorMessageReceived$.subscribe((message) => {
            this.errorMessage = message;
        });
        this.tweetStream.getTracks();
        this.tweetStream.getUsers();
    }

    addTrack(): void {
        if (this.inputTrack) {
            this.tweetStream.followTrack(this.inputTrack);
            this.inputTrack = "";
            this.queueRestart();
        }
    }

    addPriorityUser(): void {
        if (this.inputUserId) {
            this.tweetStream.followUser(this.inputUserId);
            this.inputUserId = "";
            this.queueRestart();
        }
    }

    getPriorityUsers(): void {
        this.tweetStream.getUsers();
    }

    getTracks(): void {
        this.tweetStream.getTracks();
    }

    removeTrack(index: number): void {
        this.tweetStream.removeSubscription(this.tracks[index].Id, "TRACK");
        this.tracks.splice(index, 1);
        this.queueRestart();
    }

    removePriorityUser(index: number): void {
        this.tweetStream.removeSubscription(this.priorityUsers[index].Id, "PERSON");
        this.priorityUsers.splice(index, 1);    
        this.queueRestart();
    }

    queueRestart(): void {
        this.streamRestart = true;
    }

    restartStream(): void {
        if (this.streamRestart) {
            this.streamRestart = false;
            this.tweetStream.restartStream();
        }
    }
}
