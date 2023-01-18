import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {
  isGoToThreadHovered = false;
  thread = new Thread();
  channelId: string = '';
  threadId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private _location: Location, private fireService: FirestoreService, private currentDataService: CurrentDataService, private router: Router) { }


  ngOnInit(): void {
    this.channelId = this.currentDataService.currentChannelId;
    console.log('in thread bar is id', this.currentDataService.currentChannelId);
    this.route.parent?.children[0].params.subscribe((params: any) => console.log('test', params.id)
    );


    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));

    this.thread = this.currentDataService.getThread();
  }

  subscribeCurrentChannel(param: { id: string }) {
    // console.log('Param is ', param);
    // console.log(this.route);

    this.threadId = param.id;
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + param.id + '/commentCollection';
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.collData$.subscribe((data: any) => console.log(data));
  }

  closeThread() {
    this.sidenavToggler.threadBar.close();
    this.router.navigateByUrl('main/' + this.channelId);
  }
}
