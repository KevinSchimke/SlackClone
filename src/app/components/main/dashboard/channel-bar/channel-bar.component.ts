import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  isGoToThreadHovered = false;
  channelId: string = '';
  pathToChild: string = '';
  collData$: Observable<any>;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService) { 
    this.collData$ = EMPTY;
  }

  ngOnInit(): void {
    console.log(this.route.params);
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  subscribeCurrentChannel(param: {id: string}){
    console.log(param);
    this.channelId = param.id;
    this.collData$ = this.fireService.getCollection('channels/'+param.id+'/ThreadCollection');
    console.log(this.collData$);

  }
}
