import { Component } from "@angular/core";
import { EventService } from "../Services/events.service";
import { FormsModule } from "@angular/forms";
import { TwitterLogin } from "../Services/twitterlogin.service";

@Component({
    selector: "main-admin",
    template: `
        <h2>Main admin page</h2>
        <div *ngIf="!loggedIn">
            <p>You need to login to view this page</p>
            <button (click)="login()">Login</button>
        </div>
        <div *ngIf="loggedIn">
            <p *ngIf="!loaded">Loading...</p>
            <div *ngIf="loaded">
                <ul>
                    <li *ngFor="let event of events; let i=index">
                        {{ event.Name }} (<a href="#/admin/{{event.Name}}">Admin</a>, <a href="#/events/{{event.Name}}">Visit</a>) <input type="button" value="Delete" (click)="removeEvent(i)">
                    </li>
                </ul>
                <input type="text" placeholder="Event name" [(ngModel)]="inputEventName">
                <input type="button" value="Create event" (click)="addEvent()">
            </div>
        </div>
        `
})
export class MainAdminComponent {
    events: any[] = [];
    inputEventName: string;
    loaded: boolean = false;
    loggedIn: boolean = false;

    constructor(private eventService: EventService, private twitterLogin: TwitterLogin) {
        eventService.initialise();

        eventService.getEvents().subscribe(ev => this.events = ev);
        this.loaded = this.eventService.isLoaded();
        this.eventService.initialisationChanged$.subscribe((init) => {
            this.loaded = init;
        });

        this.eventService.eventsChanged$.subscribe((eventsArray) => {
            this.events = eventsArray;
        });

        if (window.sessionStorage.getItem("token") !== null && window.sessionStorage.getItem("handle") !== null) {
            this.loggedIn = true;
        }
    }

    ngOnDestroy(): void {
        this.eventService.stopHubConnection();
    }

    addEvent(): void {
        this.eventService.addEvent(this.inputEventName);
        this.inputEventName = "";
    }

    removeEvent(index: number): void {
        this.eventService.removeEvent(this.events[index].Id);
    }

    login(): void {
        this.twitterLogin.login();
    }
}
