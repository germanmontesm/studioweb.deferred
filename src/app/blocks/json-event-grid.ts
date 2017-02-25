import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ISimpleGridEdit} from "../../comps/simple-grid-module/SimpleGrid";
import {StoreModel} from "../../store/model/StoreModel";
import {BlockService, IBlockData} from "./block-service";
import {List} from "immutable";
import * as _ from "lodash";
import {SimpleGridRecord} from "../../comps/simple-grid-module/SimpleGridRecord";
import {SimpleGridTable} from "../../comps/simple-grid-module/SimpleGridTable";

@Component({
    selector: 'json-event-grid',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <label i18n>On event take the following action</label>
        <h4 class="panel-title" style="padding-bottom: 15px">
            <button (click)="_onAddNewEvent()" type="button" title="add event" class="btn btn-default btn-sm">
                <span class="fa fa-plus"></span>
            </button>
            <button (click)="_onRemoveEvent()" type="button" title="remove event" class="btn btn-default btn-sm">
                <span class="fa fa-minus"></span>
            </button>
        </h4>
        <div style="overflow-x: scroll">
            <div style="width: 600px">
                <simpleGridTable #simpleGrid>
                    <thead>
                    <tr>
                        <th>event</th>
                        <th>action</th>
                        <th>url</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="simpleGridRecord" simpleGridRecord *ngFor="let item of m_events; let index=index" [item]="item" [index]="index">
                        <td style="width: 30%" [editable]="true" (labelEdited)="_onLabelEdited($event,index)" field="event" simpleGridData [item]="item"></td>
                        <td style="width: 35%" simpleGridDataDropdown [testSelection]="_selectedAction()" (changed)="_setAction($event,index)" field="name" [item]="item" [dropdown]="m_actions"></td>
                        <td style="width: 35%" [editable]="true" (labelEdited)="_onUrlEdited($event,index)" field="url" simpleGridData [item]="item"></td>
                    </tr>
                    </tbody>
                </simpleGridTable>
            </div>
        </div>
    `,
})
export class JsonEventGrid extends Compbaser implements AfterViewInit {

    private m_blockData: IBlockData;
    private m_events: List<StoreModel>;
    private m_actions: List<StoreModel>;

    constructor(private yp: YellowPepperService, private bs: BlockService) {
        super();
        this.m_actions = List([
            new StoreModel({name: 'firstPage'}),
            new StoreModel({name: 'nextPage'}),
            new StoreModel({name: 'prevPage'}),
            new StoreModel({name: 'lastPage'}),
            new StoreModel({name: 'loadUrl'})
        ]);
        
    }

    @ViewChild('simpleGrid')
    simpleGrid: SimpleGridTable;
    
    @Input()
    set setBlockData(i_blockData) {
        this.m_blockData = i_blockData;
        this._render();
    }

    _render() {
        this._initEventTable();
        var domPlayerData = this.m_blockData.playerDataDom
    }

    /**
     Load event list to block props UI
     @method _initEventTable
     **/
    _initEventTable() {
        var rowIndex = 0;
        var domPlayerData = this.m_blockData.playerDataDom;
        var events = [];
        jQuery(domPlayerData).find('EventCommands').children().each((k, eventCommand) => {
            var url = '';
            if (jQuery(eventCommand).attr('command') == 'loadUrl')
                url = jQuery(eventCommand).find('Url').attr('name');
            if (_.isUndefined(url) || _.isEmpty(url))
                url = '---';
            var storeModel = new StoreModel({
                event: jQuery(eventCommand).attr('from'),
                url: url,
                action: jQuery(eventCommand).attr('command')
            });
            events.push(storeModel)
            rowIndex++;
        });
        this.m_events = List(events)
    }

    _setAction(event: ISimpleGridEdit, index: number) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(index);
        jQuery(target).attr('command', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }
    
    _onRemoveEvent() {
        var record: SimpleGridRecord = this.simpleGrid.getSelected();
        if (_.isUndefined(record)) return;
        var domPlayerData = this.m_blockData.playerDataDom;
        jQuery(domPlayerData).find('EventCommands').children().eq(record.index).remove();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onAddNewEvent() {
        var domPlayerData = this.m_blockData.playerDataDom;
        var buff = '<EventCommand from="event" condition="" command="firstPage" />';
        jQuery(domPlayerData).find('EventCommands').append(jQuery(buff));
        // domPlayerData = this.rp.xmlToStringIEfix(domPlayerData)
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _selectedAction() {
        return (a: StoreModel, b: StoreModel) => {
            return a.getKey('name') == b.getKey('action') ? 'selected' : '';
        }
    }

    _onUrlEdited(event: ISimpleGridEdit, index) {
        var url = event.value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(parseInt(index));
        jQuery(target).find('Params').remove();
        jQuery(target).append('<Params> <Url name="' + url + '" /></Params>');
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _onLabelEdited(event: ISimpleGridEdit, index) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(index);
        jQuery(target).attr('from', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}