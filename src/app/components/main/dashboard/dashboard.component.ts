import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  mobileQuery: MediaQueryList;

  @ViewChild('workspaceBar') workspaceBar: any;
  @ViewChild('threadBar') threadBar: any;

  private _mobileQueryListener: () => void;

  constructor(public createChannelService: FirestoreService, public sidenavToggler: SidenavToggleService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {
    this.sidenavToggler.setWorkspaceBar(this.workspaceBar);
    setTimeout(() => this.sidenavToggler.setThreadBar(this.threadBar), 0);
  }

  toggleMode() {
    let side: MatDrawerMode = 'side'
    let over: MatDrawerMode = 'over'
    return (window.innerWidth >= 1000) ? side : over
  }
}
