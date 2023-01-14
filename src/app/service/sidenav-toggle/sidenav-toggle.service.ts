import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavToggleService {


  workspaceBar: any;
  threadBar: any;

  constructor() { }

  getChildById(workspaceBar: MatDrawer){
    this.workspaceBar = workspaceBar;
  }

  getChild2ById(threadBar: MatDrawer){
    this.threadBar = threadBar;
  }
}
