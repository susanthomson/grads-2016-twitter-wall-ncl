import { Component } from "@angular/core";
import { EventService } from "../Services/events.service";
import { FormsModule } from "@angular/forms";
import { TwitterLogin } from "../Services/twitterlogin.service";

@Component({
    selector: "main-admin",
    template: `
        <div class="container main-admin">
            <h1 class='text-center'>Admin</h1>
        {{errorMessage}}
            <div *ngIf="!loggedIn">
                <p class="lead">You need to login to view this page</p>
                <div
                    class="btn btn-primary btn-block btn-lg login"
                    (click)="login()">
                    <div *ngIf="!loggingIn">
                        <img src="/img/Twitter_Social_Icon_White.png" />
                        Login
                    </div>
                    <div *ngIf="loggingIn">
                        <div class="spinner spinner-sm spinner-light"></div>
                    </div>
                </div>
            </div>
            <div *ngIf="loggedIn">
                <div class="events-loading" *ngIf="!loaded">
                    <div class="spinner"></div>
                </div>
                <div *ngIf="loaded">
                    <ul class="list-group events">
                        <li
                            class="list-group-item event"
                            *ngFor="let event of events; let i=index">
                            <div class="event-name">{{ event.Name }}</div>
                            <div class="event-actions">
                                <a
                                    class="text-info"
                                    href="#/admin/{{event.Name}}">
                                    Manage
                                </a>
                                <a
                                    class="text-success"
                                    href="#/events/{{event.Name}}">
                                    View wall
                                </a>
                                <a
                                    class="text-danger"
                                    (click)="removeEvent(i)">
                                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                </a>
                            </div>
                        </li>
                    </ul>
                    <input
                        class="form-control input-lg form-group"
                        type="text"
                        placeholder="Event name"
                        [(ngModel)]="inputEventName"
                    />
                    <button
                        class="btn btn-primary btn-block btn-lg"
                        (click)="addEvent()">
                        CreateEvent
                    </button>
                </div>
            </div>
        </div>
        `
})
export class MainAdminComponent {
    events: any[] = [];
    inputEventName: string;
    loaded: boolean = false;
    loggedIn: boolean = false;
    loggingIn: boolean = false;
    errorMessage: string;

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
            this.loggingIn = false;
        }
    }

    ngOnDestroy(): void {
        this.eventService.stopHubConnection();
    }

    addEvent(): void {
        if(!this.inputEventName) return;
        const checkIfExists = this.events.some((elem, i) => {
          if(elem.Name == this.inputEventName) return true;
        });
        if(checkIfExists) {
          this.errorMessage = "That event name is already taken"
          return;
        }
        this.eventService.addEvent(this.inputEventName);
        this.errorMessage = '';
        this.inputEventName = "";
    }

    removeEvent(index: number): void {
        const result = confirm("Are you sure you want to remove this event?");
        if (result) {
          this.eventService.removeEvent(this.events[index].Id);
        }
    }

    login(): void {
        this.twitterLogin.login();
        this.loggingIn = true;
    }
}
