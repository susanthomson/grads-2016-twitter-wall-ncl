import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Subject } from "rxjs/Subject";

import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";

declare var $: any;
@Injectable()
export class EventService {
    private conn: any;

    private init = new Subject<boolean>();
    public initialisationChanged$ = this.init.asObservable();
    private initialised: boolean = false;

    private event = new Subject<any[]>();
    public eventsChanged$ = this.event.asObservable();

    events: any[] = [];

    constructor(private http: Http) {
    }

    initialise(): void {
        this.initialised = false;
        this.events = [];
        this.conn = $.connection.twitterHub;

        this.conn.client.receiveEvents = (events) => {
            this.events = events;
            this.event.next(events);
        };

        $.connection.hub.start({
            transport: ["webSockets", "serverSentEvents"]
        }).done(() => {
            this.initialised = true;
            this.init.next(true);
            this.conn.server.joinGroup("test");
        });
    }

    stopHubConnection(): void {
        $.connection.hub.stop();
    }

    getEvents(): any {
        return this.http.get("api/events").map(response => response.json());
    }

    removeEvent(eventId: number): void {
        this.conn.server.removeEvent(eventId);
    }

    addEvent(name: string): void {
        this.conn.server.addEvent(name);
    }

    isLoaded(): boolean {
        return this.initialised;
    }
}