import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CampaignsNavigation} from "./campaigns-navigation";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";
import {DropdownModule} from "ng2-bootstrap";
import {Campaigns} from "./campaigns";
import {OrderListModule} from "primeng/components/orderlist/orderlist";
import {CampaignManager} from "./campaign-manager";
import {CampaignName} from "./campaign-name";
import {CampaignOrientation} from "./campaign-orientation";
import {CampaignLayout} from "./campaign-layout";
import {CampaignEditor} from "./campaign-editor";
import {CampaignResolution} from "./campaign-resolution";
import {CampaignList} from "./campaign-list";
import {Sequencer} from "./sequencer";
import {ScreenLayoutEditor} from "./screen-layout-editor";
import {ScreenLayoutEditorProps} from "./screen-layout-editor-props";
import {CampaignProps} from "./campaign-props";
import {TimelineProps} from "./timeline-props";
import {ChannelProps} from "./channel-props";
import {DashboardProps} from "./dashboard-props";
import {CampaignEditorProps} from "./campaign-editor-props";
import {CampaignSchedProps} from "./campaign-sched-props";
import {CampaignPropsManager} from "./campaign-props-manager";

export const LAZY_ROUTES = [
    {path: ':folder', component: CampaignsNavigation},
    {path: ':folder/:id', component: CampaignsNavigation},
    {path: '**', component: CampaignsNavigation}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, DropdownModule, OrderListModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [CampaignsNavigation, Campaigns, CampaignManager, CampaignName, CampaignOrientation, CampaignLayout,
        CampaignEditor, CampaignResolution, CampaignList, Sequencer, ScreenLayoutEditor, ScreenLayoutEditorProps,
        CampaignPropsManager, CampaignProps, TimelineProps, ChannelProps, DashboardProps, CampaignEditorProps, CampaignSchedProps]
})
export class CampaignsLazyModule {
}