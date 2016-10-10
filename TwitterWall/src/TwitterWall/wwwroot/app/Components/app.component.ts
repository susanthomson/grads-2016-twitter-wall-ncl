import { Component } from "@angular/core";
import { BubbleComponent } from "./bubble.component";

@Component({
    selector: "my-app",
    template: `
        <a routerLink="/" >Home</a>
        <a routerLink="/admin" >Admin Panel</a>
        <router-outlet></router-outlet>
        `
})
export class AppComponent { }
