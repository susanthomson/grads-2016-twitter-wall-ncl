import { Component } from "@angular/core";
import { TweetStream } from "../Services/tweetstream.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "subscriptions",
    template: `
        <h4>Subscribing to</h4>
        <ul>
            <li *ngFor="let track of tracks; let i=index">
                {{ track.Value }}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removeTrack(i)"></span>
            </li>
        </ul>
        <p *ngIf="tracks.length === 0">List is empty</p>
        <input type="text" maxlength="60" placeholder="Enter keyword" [(ngModel)]="inputTrack" />
        <button type="button" (click)="addTrack()">Follow</button>
        <button type="button" (click)="getTracks()">Refresh</button>

        <ul>
            <li *ngFor="let user of priorityUsers; let i=index">
                {{ user.Value }}
                <span class="glyphicon glyphicon-minus" aria-hidden="true" (click)="removePriorityUser(i)"></span>
            </li>
        </ul>
        <p *ngIf="priorityUsers.length === 0">List is empty</p>
        <input type="text" placeholder="Enter user id" [(ngModel)]="inputUserId" />
        <button type="button" (click)="addPriorityUser()">Follow</button>
        <button type="button" (click)="getPriorityUsers()">Refresh</button>

        <div *ngIf="streamRestart">
            <p>For changes to take effect stream needs to be restarted!(Usually it takes ~30 seconds for stream to fully restart)</p>
            <button type="button" (click)="restartStream()">Restart stream</button>
        </div>
        `
})
export class Subscriptions {    
    inputTrack: any;
    inputUserId: any;
    tracks: Array<{ Id: number, Value: string, Type: string }> = [];
    priorityUsers: Array<{ Id: number, Value: string, Type: string }> = [];
    streamRestart: boolean = false;

    constructor(private tweetStream: TweetStream) {
        this.tweetStream.tracksReceived$.subscribe((keywords) => {
            this.tracks = keywords;
        });
        this.tweetStream.usersReceived$.subscribe((users) => {
            this.priorityUsers = users;
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
        console.log("HEY HO");
        console.log(this.priorityUsers[index].Id);
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