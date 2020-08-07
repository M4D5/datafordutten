import {animate, query, style, transition, trigger} from "@angular/animations";

export const fadeAnimation =
    trigger('fadeAnimation', [
        transition('* => *', [
            query(':enter',
                [
                    style({opacity: 0})
                ],
                {optional: true}
            ),

            query(':leave',
                [
                    style({opacity: 1, position: 'absolute', width: '100%', 'z-index': 9999}),
                    animate('100ms ease-out', style({opacity: 0}))
                ],
                {optional: true}
            ),

            query(':enter',
                [
                    style({opacity: 0, position: 'relative', width: '100%'}),
                    animate('100ms ease-in', style({opacity: 1}))
                ],
                {optional: true}
            )
        ])
    ]);
