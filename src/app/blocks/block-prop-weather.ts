import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {simpleRegExp, urlRegExp} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-weather',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form novalidate autocomplete="off" class="inner5">
            <div class="row">
                <div *ngIf="!jsonMode">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div id="blockClockCommonProperties">
                                <span i18n>Choose format</span>
                                <div class="radio" *ngFor="let item of m_temps">
                                    <label>
                                        <input type="radio" name="units" (click)="m_unit = item; _onFormatChanged(item)"
                                               [checked]="item.value === m_unit" [value]="item">
                                        {{item.label}}
                                    </label>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div id="blockClockCommonProperties">
                                <span i18n>Choose style</span>
                                <div class="radio" *ngFor="let item of m_styles">
                                    <label>
                                        <input type="radio" name="styles" (click)="m_style = item; _onFormatChanged(item)"
                                               [checked]="item.value === m_style" [value]="item">
                                        {{item.label}}
                                    </label>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            address / zip code
                            <input type="text" [formControl]="contGroup.controls['address']"/>
                        </li>
                    </ul>
                </div>
                <div *ngIf="jsonMode">
                    <block-prop-json-player [setBlockData]="m_blockData"></block-prop-json-player>
                </div>
            </div>
        </form>
    `
})
export class BlockPropWeather extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private contGroup: FormGroup;
    private m_blockData: IBlockData;

    m_temps = [{label: 'Fahrenheit', value: 'F'}, {label: 'Celsius', value: 'C'}]
    m_styles = [{label: 'black', value: 1}, {label: 'white', value: 2}, {label: 'color', value: 3}]
    m_unit = 'F'
    m_style = 0;

    constructor(private fb: FormBuilder, private rp: RedPepperService, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.contGroup = fb.group({
            'address': ['', [Validators.pattern(simpleRegExp)]]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })
    }

    @Input() jsonMode: boolean;


    @Input()
    set setBlockData(i_blockData) {
        if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
            this.m_blockData = i_blockData;
            this._render();
        } else {
            this.m_blockData = i_blockData;
        }
    }

    private _render() {

        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom
        var $data = $(domPlayerData).find('Json').find('Data');
        this.m_unit = $data.attr('unit');
        this.m_style = Number($data.attr('style'));
        var address = $data.attr('address');
        this.formInputs['address'].setValue(address);


        // this.contGroup.reset();

        // var xSnippet = jQuery(domPlayerData).find('HTML');
        // this.formInputs['url'].setValue(xSnippet.attr('src'));
    }

    ngAfterViewInit() {
        this._render();
    }


    destroy() {
    }
}
