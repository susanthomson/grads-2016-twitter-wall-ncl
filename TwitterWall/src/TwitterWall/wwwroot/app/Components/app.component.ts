import { Component } from "@angular/core";
import { BubbleComponent } from "./bubble.component";

@Component({
    selector: "my-app",
    template: `
        <router-outlet></router-outlet>
        `
})
export class AppComponent { }
