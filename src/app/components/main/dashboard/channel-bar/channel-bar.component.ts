import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  collData$: Observable<any> = EMPTY;
  @ViewChild('threadBar') threadBar: any;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router) {}

  ngAfterViewInit(){
    this.sidenavToggler.getChild2ById(this.threadBar);
  }

  ngOnInit(): void {
    // console.log(this.route.params);
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }


  subscribeCurrentChannel(param: { id: string }) {
    // console.log(param);
    this.channelId = param.id;
    this.collData$ = this.fireService.getCollection('channels/' + param.id + '/ThreadCollection');
    // console.log(this.collData$);

  }

  openThread(threadId: string){
    this.threadBar.open();
    this.router.navigateByUrl('main/' + this.channelId+"/"+threadId);
  }
}
