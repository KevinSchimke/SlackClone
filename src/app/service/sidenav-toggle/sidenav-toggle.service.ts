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
  changeBool = this.threadBarIsInit.asObservable();

  constructor() { }

  setWorkspaceBar(workspaceBar: MatDrawer){
    this.workspaceBar = workspaceBar;
  }

  setThreadBar(threadBar: MatDrawer){
    this.threadBar = threadBar;
    console.log(this.threadBarIsInit);
    this.threadBarIsInit.next(true);
    console.log(this.threadBarIsInit);
    console.log(threadBar);
  }
}
