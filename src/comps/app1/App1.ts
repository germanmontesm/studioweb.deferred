import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {
    CommBroker,
    IMessage
} from "../../services/CommBroker";
import {Consts} from "../../../src/Conts";

@Component({
    template: `
        <div class="row" style="margin-left: 0; margin-right: 0;">
        <ng-menu [routePrefix]="'App1'" [fileMenuMode]="true">
            <ng-menu-item [fontawesome]="'fa-dashboard'" [title]="'Dashboard'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-navicon'" [title]="'Campaigns'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-certificate'" [title]="'Resources'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-edit'" [title]="'Scenes'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-laptop'" [title]="'Stations'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-group'" [title]="'Fasterq'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-cog'" [title]="'Settings'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-cloud-upload'" [title]="'Studiopro'"></ng-menu-item>
            <ng-menu-item [fontawesome]="'fa-power-off'" [title]="'Logout'"></ng-menu-item>
        </ng-menu>
          <div id="mainPanelWrapWasp" style="padding-left: 60px" class="mainContent col-xs-12 col-sm-12 col-md-12 col-lg-11">
            <router-outlet></router-outlet>
          </div>
        </div>
    `
})
export class App1 {
    private routerActive: boolean;

    constructor(private commBroker: CommBroker, private router: Router) {
        jQuery(".navbar-header .navbar-toggle").trigger("click");
        jQuery('.navbar-nav').css({
            display: 'block'
        });
        this.listenMenuChanges();
    }

    ngOnInit() {
        this.routerActive = true;
    }

    public listenMenuChanges() {
        var self = this;
        var unsub = self.commBroker.onEvent(Consts.Events().MENU_SELECTION).subscribe((e: IMessage) => {
            if (!self.routerActive)
                return;
            let screen = (e.message);
            self.router.navigate([`/App1/${screen}`]);
        });
    }
}