import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    template: `
               <small class="release">stations
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
           `,
})
export class StationsNavigation extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}