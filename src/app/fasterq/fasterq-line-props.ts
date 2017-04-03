import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'fasterq-line-props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
    `,
})
export class FasterqLineProps extends Compbaser implements AfterViewInit {

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
