import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable} from "rxjs";
import * as _ from "lodash";
import {NGValidators} from "ng-validators";
import {equalValueValidator} from "../../Lib";

@Component({
    selector: 'pro-upgrade',
    host: {'(input-blur)': 'saveToStore($event)'},
    templateUrl: './pro-upgrades.html',
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
export class ProUpgrade extends Compbaser {

    campaignModel: CampaignsModelExt;
    formInputs = {};
    m_contGroup: FormGroup;
    campaignModel$: Observable<CampaignsModelExt>;

    constructor(private fb: FormBuilder, private yp: YellowPepperService, private rp: RedPepperService) {
        super();

        this.m_contGroup = this.fb.group({
                'userName': ['', [Validators.required]],
                'creditCard': ['', [NGValidators.isCreditCard()]],
                'month': ['', [NGValidators.isNumeric()]],
                'year': ['', [NGValidators.isNumeric()]],
                'cv': ['', [NGValidators.isNumeric()]],
                'password': ['', [Validators.required, Validators.minLength(3)]],
                'confirmPassword': ['', [Validators.required, Validators.minLength(3)]]
            },
            {validator: equalValueValidator('password', 'confirmPassword')}
        );

        // this.m_contGroup = fb.group({
        //     'campaign_name': ['', [Validators.required, Validators.pattern(simpleRegExp)]],
        //     'campaign_playlist_mode': [0],
        //     'kiosk_mode': [0],
        //
        //
        // });
        // _.forEach(this.m_contGroup.controls, (value, key: string) => {
        //     this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        // })

        // this.cancelOnDestroy(
        //     this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
        //         this.campaignModel = campaign;
        //         this.renderFormInputs();
        //     })
        // )
        //
        // this.campaignModel$ = this.yp.listenCampaignValueChanged()

    }


    @timeout()
    private saveToStore(event) {
        // console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        console.log(this.m_contGroup.status);
        // if (this.m_contGroup.status != 'VALID')
        //     return;
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.m_contGroup.value.campaign_name);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.m_contGroup.value.campaign_playlist_mode);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.m_contGroup.value.kiosk_mode);
        // this.rp.reduxCommit()
    }

    private renderFormInputs() {
        if (!this.campaignModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.campaignModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    // detectCardType(number) {
    //     var re = {
    //         electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
    //         maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
    //         dankort: /^(5019)\d+$/,
    //         interpayment: /^(636)\d+$/,
    //         unionpay: /^(62|88)\d+$/,
    //         visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    //         mastercard: /^5[1-5][0-9]{14}$/,
    //         amex: /^3[47][0-9]{13}$/,
    //         diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    //         discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    //         jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    //     };
    //     if (re.electron.test(number)) {
    //         return 'ELECTRON';
    //     } else if (re.maestro.test(number)) {
    //         return 'MAESTRO';
    //     } else if (re.dankort.test(number)) {
    //         return 'DANKORT';
    //     } else if (re.interpayment.test(number)) {
    //         return 'INTERPAYMENT';
    //     } else if (re.unionpay.test(number)) {
    //         return 'UNIONPAY';
    //     } else if (re.visa.test(number)) {
    //         return 'VISA';
    //     } else if (re.mastercard.test(number)) {
    //         return 'MASTERCARD';
    //     } else if (re.amex.test(number)) {
    //         return 'AMEX';
    //     } else if (re.diners.test(number)) {
    //         return 'DINERS';
    //     } else if (re.discover.test(number)) {
    //         return 'DISCOVER';
    //     } else if (re.jcb.test(number)) {
    //         return 'JCB';
    //     } else {
    //         return undefined;
    //     }
    // }

    // private showMessage(i_title: string, i_msg: string, i_status: boolean): void {
    //     bootbox.hideAll();
    //     bootbox.dialog({
    //         closeButton: true,
    //         title: i_title,
    //         message: `<br/><br/><br/>
    //                             ${i_status == true ? '<i style="color: green; font-size: 4em; padding:30px" class="fa fa-thumbs-up"></i>'
    //             : '<i style="color: red; font-size: 4em; padding: 30px" class="fa fa-thumbs-down"></i>'}
    //                                 <h4>${i_msg}</h4>
    //                           <br/><br/><br/>
    //                            `
    //     });
    // }

    // private  validateAndUpgrade() {
    //     let errors = [];
    //     // let resellerName = $(Elements.UPG_USERNAME).val();
    //     // let resellerPass = $(Elements.UPG_PASS).val();
    //     // let resellerPass2 = $(Elements.UPG_PASS2).val();
    //     // let userName = BB.Pepper.getUserData().userName;
    //     // let userPass = BB.Pepper.getUserData().userPass;
    //     // let credit = $(Elements.UPG_CREDIT).val();
    //     var credit = 'VISA';
    //     let card = this.detectCardType(credit);
    //     // let cv = $(Elements.UPG_CV).val();
    //     // let year = $(Elements.UPG_YEAR).val().length == 2 ? '20' + $(Elements.UPG_YEAR).val() : $(Elements.UPG_YEAR).val();
    //     // let month = $(Elements.UPG_MONTH).val().replace(/^0+/, '');
    //
    //     switch (card) {
    //         case 'VISA': {
    //             card = '0';
    //             break;
    //         }
    //         case 'MASTERCARD': {
    //             card = '1';
    //             break;
    //         }
    //         case 'DISCOVER': {
    //             card = '2';
    //             break;
    //         }
    //         case 'AMEX': {
    //             card = '3';
    //             break;
    //         }
    //         default: {
    //             card = '-1';
    //         }
    //     }
    //
    //     // if (resellerName.length < 4)
    //     //     errors.push('Enterprise user name is invalid');
    //     // if (card == '-1')
    //     //     errors.push('Credit card type not supported');
    //     // if (!validator.isCreditCard(credit))
    //     //     errors.push('Credit card number is invalid');
    //     // if (!validator.isInt(cv))
    //     //     errors.push('Credit card security code is invalid');
    //     // if (!validator.isInt(year))
    //     //     errors.push('Credit card year is invalid');
    //     // if (!validator.isInt(month))
    //     //     errors.push('credit card month is invalid, must be a number like 1 for Jan');
    //     // if (resellerPass.length < 4 || resellerPass != resellerPass2)
    //     //     errors.push('Password is invalid');
    //     // if (errors.length > 0) {
    //     //     bootbox.alert(errors.join('<br/>'));
    //     //     //if (false) {
    //     // } else {
    //     //     bootbox.dialog({
    //     //         closeButton: false,
    //     //         title: "Please wait, validating...",
    //     //         message: `<br/><br/><br/>
    //     //                             <img src="./_assets/preload6.gif"></span>
    //     //                       <br/><br/><br/>
    //     //                         `
    //     //     });
    //     //
    //     //     var url = `https://galaxy.signage.me/WebService/UpgradeToResellerAccount.ashx?userName=${userName}&userPassword=${userPass}&resellerUserName=${resellerName}&resellerPassword=${resellerPass}&cardType=${card}&cardNumber=${credit}&expirationMonth=${month}&expirationYear=${year}&securityCode=${cv}&callback=?`;
    //     //     $.getJSON(url, function (e) {
    //     //         var msg = '';
    //     //         console.log('Credit card status ' + e.result);
    //     //         switch (e.result) {
    //     //             case -4: {
    //     //                 msg = 'This user is already under a subscription account';
    //     //                 this.showMessage(e.status, msg, false);
    //     //                 return;
    //     //             }
    //     //             case -5: {
    //     //                 msg = 'Enterprise use name is taken, please pick a different name';
    //     //                 this.showMessage(e.status, msg, false);
    //     //                 return;
    //     //             }
    //     //             case -3: {
    //     //             }
    //     //             case -2: {
    //     //             }
    //     //             case -1: {
    //     //                 msg = 'Problem with credit card, please use a different card';
    //     //                 this.showMessage(e.status, msg, false);
    //     //                 return;
    //     //             }
    //     //             default: {
    //     //                 if (e.result > 100) {
    //     //                     bootbox.hideAll();
    //     //                     $('.modal').modal('hide');
    //     //                     //var snippet = `Congratulations, be sure to checkout the <a href="http://www.digitalsignage.com/_html/video_tutorials.html?videoNumber=liteUpgrade" target="_blank">video tutorial</a> on how to install your newly available components from the mediaSTORE`;
    //     //                     var snippet = `Congratulations, be sure to go to the mediaSTORE and install your newly available components...`;
    //     //                     this.showMessage('success', snippet, true);
    //     //                     return;
    //     //                 } else {
    //     //                     msg = 'Problem with credit card, please use a different card';
    //     //                     this.showMessage(e.status, msg, false);
    //     //                 }
    //     //             }
    //     //         }
    //     //     })
    //     //         .done(function (e) {
    //     //         })
    //     //         .fail(function (e) {
    //     //             this.showMessage(e.status, 'Could not complete, something went wrong on server side', false);
    //     //         })
    //     //         .always(function () {
    //     //         });
    //     // }
    // }

    destroy() {
    }
}