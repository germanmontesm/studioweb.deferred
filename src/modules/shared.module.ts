import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {Infobox} from "../comps/infobox/Infobox";
import {Sliderpanel} from "../comps/sliderpanel/Sliderpanel";
import {Slideritem} from "../comps/sliderpanel/Slideritem";
import {PanelSplitMain} from "../comps/panel-split/panel-split-main";
import {PanelSplitSide} from "../comps/panel-split/panel-split-side";
import {PanelSplitContainer} from "../comps/panel-split/panel-split-container";
import {ListToArrayPipe} from "../pipes/list-to-array-pipe";
import {MatchHeight} from "../comps/match-height/match-height";

var sharedComponents = [Infobox, Sliderpanel, Slideritem, PanelSplitMain, PanelSplitSide, PanelSplitContainer, ListToArrayPipe, MatchHeight];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ...sharedComponents],
    declarations: [...sharedComponents]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}