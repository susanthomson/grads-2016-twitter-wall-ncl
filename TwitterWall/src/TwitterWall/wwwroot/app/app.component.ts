import { Component } from "@angular/core";
import { BubbleComponent } from "./bubble.component";

@Component({
    selector: "my-app",
    template: `<h1>Twitter Wall</h1>
    <bubble-canvas></bubble-canvas>
    `
})
export class AppComponent { }
