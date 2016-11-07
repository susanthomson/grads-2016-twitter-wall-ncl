import { Component } from "@angular/core";
import { TweetStream } from "../Services/tweetstream.service";
import { FormsModule } from "@angular/forms";
import { Subscription } from "../Models/subscription";

@Component({
    selector: "subscriptions",
    template: `
        <div class="alert alert-danger" *ngIf="errorMessage">{{errorMessage}}</div>
        <div class="col-md-6">
            <div class="panel panel-warning">
                <div class="panel-heading">Follow a keyword</div>
                <form>
                    <input type="text" class="form-control form-group" name="inputKeyword" maxlength="60" placeholder="Enter keyword to follow" [(ngModel)]="inputTrack" />
                    <button class="btn btn-success btn-block" type="button" (click)="addTrack()"><span class="glyphicon glyphicon-font" aria-hidden="true"></span> Follow Keyword</button>
                </form>
                <ul class="list-group">
                    <li class="list-group-item" *ngIf="tracks.length === 0">You are currently following no keywords.</li>
                    <li class="list-group-item keyword-follow" *ngFor="let track of tracks; let i=index">
                        {{ track.Value }}
                        <span class="glyphicon glyphicon-remove text-danger delete" aria-hidden="true" (click)="removeTrack(i)"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel panel-success">
                <div class="panel-heading">Follow a user</div>
                <form>
                    <div class="form-group">
                        <input type="text" name="inputUser" class="form-control form-group" placeholder="Username" [(ngModel)]="inputUserId" />
                    </div>
                    <button class="btn btn-primary btn-block" type="button" (click)="addPriorityUser()"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Follow User</button>
                </form>
                <ul class="list-group">
                    <li class="list-group-item" *ngIf="priorityUsers.length === 0">You are currently following no users.</li>
                    <li class="list-group-item user-follow" *ngFor="let user of priorityUsers; let i=index">
                        {{ user.Value }}
                        <span class="glyphicon glyphicon-remove text-danger" aria-hidden="true" (click)="removePriorityUser(i)"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div *ngIf="streamRestart">
            <p>For changes to take place, you must save your changes:</p>
            <button type="button" class="btn btn-danger" (click)="restartStream()">Save changes</button>
        </div>
        `
})
export class Subscriptions {
    inputTrack: any;
    inputUserId: any;
    tracks: Array<Subscription> = [];
    priorityUsers: Array<Subscription> = [];
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
        this.getTracks();
        this.getPriorityUsers();
    }

    addTrack(): void {
        if (!this.inputTrack)
            return;

        const checkIfExists = this.tracks.some((elem, i) => {
            if (elem.Value === this.inputTrack)
                return true;
        });

        if (checkIfExists) {
            this.errorMessage = "You are already following that keyword";
            return;
        };

        this.tweetStream.addTrack(this.inputTrack);
        this.inputTrack = "";
        this.errorMessage = "";
        this.queueRestart();
    }

    addPriorityUser(): void {
        if (!this.inputUserId)
            return;

        const checkIfExists = this.priorityUsers.some((elem, i) => {
            if (elem.Value === this.inputUserId)
                return true;
        });

        if (checkIfExists) {
            this.errorMessage = "You are already following that user";
            return;
        };

        this.tweetStream.followUser(this.inputUserId);
        this.inputUserId = "";
        this.errorMessage = "";
        this.queueRestart();
    }

    getPriorityUsers(): void {
        this.tweetStream.getPriorityUsers();
    }

    getTracks(): void {
        this.tweetStream.getTracks();
    }

    removeTrack(index: number): void {
        this.tweetStream.removeTrack(this.tracks[index].Id);
        this.tracks.splice(index, 1);
        this.queueRestart();
    }

    removePriorityUser(index: number): void {
        this.tweetStream.removePriorityUser(this.priorityUsers[index].Id);
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