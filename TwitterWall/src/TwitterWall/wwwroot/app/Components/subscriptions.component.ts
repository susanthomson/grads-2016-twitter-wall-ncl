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
        <input type="text" maxlength="60" placeholder="Enter track" [(ngModel)]="inputTrack" />
        <button type="button" (click)="addTrack()">Follow</button>
        <button type="button" (click)="getTracks()">Refresh</button>
        <div *ngIf="streamRestart">
            <p>For changes to take effect stream needs to be restarted!(Usually it takes ~30 seconds for stream to fully restart)</p>
            <button type="button" (click)="restartStream()">Restart stream</button>
        </div>
        `
})
export class Subscriptions {    
    inputTrack: any;
    tracks: Array<{ Id: number, Value: string, Type: string }> = [];
    streamRestart: boolean = false;

    constructor(private tweetStream: TweetStream) {
        this.tweetStream.tracksReceived$.subscribe((keywords) => {
            this.tracks = keywords;
        });
        this.tweetStream.getTracks();
    }

    addTrack(): void {
        if (this.inputTrack) {
            this.tweetStream.followTrack(this.inputTrack);
            this.inputTrack = "";
            this.queueRestart();
        }
    }

    getTracks(): void {
        this.tweetStream.getTracks();
    }

    removeTrack(index: number): void {
        this.tweetStream.removeTrack(this.tracks[index].Id);
        this.tracks.splice(index, 1);
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