import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {

  channelId: string = '';
  pathToChild: string = '';
  collData$: Observable<any> = EMPTY;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private _location: Location){}


  ngOnInit(): void {
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  subscribeCurrentChannel(param: { id: string }) {
    
    // console.log(param);
    // this.channelId = param.id;
    // this.collData$ = this.fireService.getCollection('channels/' + param.id + '/ThreadCollection');
    // console.log(this.collData$);

  }

  closeThread(){
    this.sidenavToggler.threadBar.close();
    this._location.back();
  }
}
