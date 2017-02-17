import {Inject, Injectable} from "@angular/core";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import X2JS from "x2js";
import {BlockLabels, HelperPepperService} from "../../services/helperpepper-service";
import * as _ from "lodash";
import {Observable} from "rxjs";
import {CampaignTimelineChanelPlayersModelExt} from "../../store/model/msdb-models-extended";

export interface IBlockData {
    blockID: number;
    blockType: string;
    blockCode: string;
    blockName: string;
    blockDescription: string;
    blockIcon: string;
    blockFontAwesome: string;
    blockAcronym: string;
    blockMinWidth: number;
    blockMinHeight: number;
    playerDataJson: {};
    playerDataDom: XMLDocument,
    campaignTimelineChanelPlayersModelExt: CampaignTimelineChanelPlayersModelExt,
    length?: number;
}

@Injectable()
export class BlockService {
    parser;

    private m_zIndex = -1;
    private m_minSize = {w: 50, h: 50};

    constructor(@Inject('BLOCK_PLACEMENT') private blockPlacement: string, private yp: YellowPepperService, private hp: HelperPepperService) {
        this.parser = new X2JS({
            escapeMode: true,
            attributePrefix: "_",
            arrayAccessForm: "none",
            emptyNodeForm: "text",
            enableToStringFunc: true,
            arrayAccessFormPaths: [],
            skipEmptyTextNodesForObj: true
        });
    }

    public getServiceType(): string {
        return this.blockPlacement;
    }

    /**
     Get block data as a json formatted object literal and return to caller
     @method getBlockData
     @return {object} data
     The entire block data members which can be made public
     **/
    public getBlockData(blockId): Observable<IBlockData> {

        return this.yp.getBlockRecord(blockId)
            .mergeMap((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModelExt) => {
                // var t0 = performance.now();
                var xml = i_campaignTimelineChanelPlayersModel.getPlayerData();
                var playerDataDom = $.parseXML(xml);
                let playerDataJson = this.parser.xml2js(xml);
                if (playerDataJson['Player']['_player']) {
                    /** Standard block **/
                    var code = playerDataJson['Player']['_player'];

                    var blockType = this.hp.getBlockNameByCode(code)
                    if (_.isUndefined(blockType)) {
                        var e = `Panic using a component / block which is not supported yet ${code} ${blockType}`;
                        throw new Error(e)
                    }
                    // console.log(`Serialization of block ${code} took ${(performance.now() - t0)} milliseconds`)

                } else {
                    /** Scene **/
                    var blockCode = blockCode['BLOCKCODE_SCENE'];
                    // if (_.isUndefined(i_scene_id)) {
                    //     var domPlayerData = $.parseXML(i_player_data);
                    //     i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
                }
                var data = {
                    blockID: blockId,
                    blockType: blockType,
                    blockCode: code,
                    blockName: this.hp.getBlockBoilerplate(code).name,
                    blockDescription: this.hp.getBlockBoilerplate(code).description,
                    blockIcon: this.hp.getBlockBoilerplate(code).icon,
                    blockFontAwesome: this.hp.getBlockBoilerplate(code).fontAwesome,
                    blockAcronym: this.hp.getBlockBoilerplate(code).acronym,
                    blockMinWidth: this.m_minSize.w,
                    blockMinHeight: this.m_minSize.h,
                    playerDataDom: playerDataDom,
                    playerDataJson: playerDataJson,
                    campaignTimelineChanelPlayersModelExt: i_campaignTimelineChanelPlayersModel
                };

                return Observable.of(data)
            })
    }
}


// getPlayerData = (i_type) => {
//     if (i_type == '1') {
//         return getDiggData();
//     } else {
//         return getYouTubeData();
//     }
//
// }