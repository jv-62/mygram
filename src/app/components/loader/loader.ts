import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-full-loader',
    template: `
   <div class="loading" *ngIf="display">
        <div class="lds-roller mx-auto">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
`,
    styleUrls: ['./loader.css']
})
export class LoaderComponent {
    @Input() display: boolean;

}


