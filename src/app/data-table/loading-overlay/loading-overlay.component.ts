import {Component, HostBinding, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-loading-overlay',
    templateUrl: './loading-overlay.component.html',
    styleUrls: ['./loading-overlay.component.scss'],
    animations: [
        trigger('fade', [
            state('false', style({
                display: 'none',
                opacity: 0
            })),
            state('true', style({
                opacity: 1
            })),
            transition('false => true', [
                style({'display': 'flex'}),
                animate('200ms ease')
            ]),
            transition('true => false', animate('200ms ease'))
        ])
    ]
})
export class LoadingOverlayComponent {
    @HostBinding('class.w-100') fillW: boolean = true;
    @HostBinding('class.h-100') fillH: boolean = true;

    @Input()
    visible = false;
}
