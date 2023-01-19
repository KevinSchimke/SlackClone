import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavToggleService {

  workspaceBar: any;
  threadBar: any;
  threadBarIsInit: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  setWorkspaceBar(workspaceBar: MatDrawer){
    this.workspaceBar = workspaceBar;
  }

  setThreadBar(threadBar: MatDrawer){
    this.threadBar = threadBar;
    this.threadBarIsInit.next(true);
  }
}
