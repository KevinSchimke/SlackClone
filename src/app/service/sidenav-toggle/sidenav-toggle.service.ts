import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavToggleService {


  workspaceBar: any;
  threadBar: any;

  constructor() { }

  getChildById(threadBar: MatDrawer,workspaceBar: MatDrawer){
    this.threadBar = threadBar;
    this.workspaceBar = workspaceBar;
  }
}
