import {ChangeDetectorRef, Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Observable} from "rxjs";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";

@Component({
    selector: 'timeline-props',
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `
        <div>
            <form novalidate autocomplete="off" [formGroup]="m_contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="panel panel-default tallPanel">
                            <div class="panel-heading">
                                <small class="release">target properties
                                    <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                                </small>
                                <small class="debug">{{me}}</small>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div *ngIf="(campaignModel$ | async)?.getCampaignPlaylistMode() == '1'">
                                        <h4><i class="fa fa-calendar"></i>playback mode: scheduler</h4>
                                    </div>
                                    <div *ngIf="(campaignModel$ | async)?.getCampaignPlaylistMode() == '0'">
                                        <h4><i class="fa fa fa-repeat"></i>playback mode: sequencer</h4>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <h3>{{m_duration}}</h3>
                                </li>
                                <li class="list-group-item">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <input [formControl]="m_contGroup.controls['timeline_name']" required
                                               pattern="[0-9]|[a-z]|[A-Z]+"
                                               type="text" class="form-control" minlength="3" maxlength="15"
                                               placeholder="timeline name">
                                    </div>
                                    <br/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    styles: [`
        input.ng-invalid {
            border-right: 10px solid red;
        }

        .material-switch {
            position: relative;
            padding-top: 10px;
        }

        .input-group {
            padding-top: 10px;
        }

        i {
            width: 20px;
        }
    `]
})
export class TimelineProps extends Compbaser {

    private timelineModel: CampaignTimelinesModel;
    private formInputs = {};
    private m_duration: string = '00:00:00'
    private m_contGroup: FormGroup;
    private campaignModel$: Observable<CampaignsModelExt>;

    // private m_timelineSelected$: Observable<CampaignTimelinesModel>;

    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private yp: YellowPepperService, private rp: RedPepperService, private cd: ChangeDetectorRef) {
        super();


        this.m_contGroup = fb.group({
            'timeline_name': ['']
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })


        this.campaignModel$ = this.yp.listenCampaignValueChanged()

        this.listenUpdatedForm();

        //this.renderFormInputsReactive();
        //this.m_timelineSelected$ = this.yp.getTimeline()
        //this.m_timelineSelected$ = this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)

        this.cancelOnDestroy(
            this.yp.listenTimelineSelected()
                .subscribe((i_timelineModel: CampaignTimelinesModel) => {
                    this.timelineModel = i_timelineModel;
                    var totalDuration = parseInt(i_timelineModel.getTimelineDuration())
                    var xdate = new XDate();
                    this.m_duration = xdate.clearTime().addSeconds(totalDuration).toString('HH:mm:ss');
                    this.renderFormInputs();
                    this.cd.markForCheck();
                })
        );

    }

    // @Input()
    // set setTimelineModel(i_timelineModel) {
    //     if (i_timelineModel)
    //         this.renderFormInputs();
    // }

    private onFormChange(event) {
        this.updateSore();
    }

    private listenUpdatedForm() {
        this.cancelOnDestroy(
            this.m_contGroup.statusChanges
                .filter(valid => valid === 'VALID')
                .withLatestFrom(this.m_contGroup.valueChanges, (valid, value) => value)
                .debounceTime(1000)
                .subscribe(value => {
                    console.log('res ' + JSON.stringify(value) + ' ' + Math.random())
                })                            
        )
    }

    @timeout()
    private updateSore() {
        console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        this.rp.setCampaignTimelineRecord(this.timelineModel.getCampaignTimelineId(), 'timeline_name', this.m_contGroup.value.timeline_name);
        this.rp.reduxCommit()
    }


    // private renderFormInputsReactive() {
    //     this.cancelOnDestroy(
    //         this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)
    //             .switchMap((i_timelineId: number) => {
    //                 return this.yp.getTimeline(i_timelineId)
    //             }).subscribe((v: CampaignTimelinesModel) => {
    //             var bb = v.toPureJs();
    //             this.m_contGroup.patchValue(bb);
    //         })
    //     )
    // };

    private renderFormInputs() {
        if (!this.timelineModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.timelineModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
    }
}
