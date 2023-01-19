import { Component, ViewChild } from '@angular/core';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  @ViewChild('workspaceBar') workspaceBar: any;
  @ViewChild('threadBar') threadBar: any;

  constructor(public createChannelService: FirestoreService, public sidenavToggler: SidenavToggleService) { }

  ngAfterViewInit() {
    this.sidenavToggler.setWorkspaceBar(this.workspaceBar);
    setTimeout(() => {
      this.sidenavToggler.setThreadBar(this.threadBar);
    }, 0);
  }
}
