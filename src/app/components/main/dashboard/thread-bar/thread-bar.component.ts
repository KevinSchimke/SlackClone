import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {
  isGoToThreadHovered = false;

  channelId: string = '';
  threadId: string = '';
  collData$: Observable<any> = EMPTY;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private _location: Location, private fireService: FirestoreService) { }


  ngOnInit(): void {
    if (this.route.parent) {
      this.route.parent.url.subscribe((parent: any) => {
        this.channelId = parent[0].path;
        console.log(this.channelId);
      });
    }
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  subscribeCurrentChannel(param: { id: string }) {
    this.threadId = param.id;
    console.log('channels/' + this.channelId + '/ThreadCollection/' + param.id + '/commentCollection');
    this.collData$ = this.fireService.getCollection('channels/' + this.channelId + '/ThreadCollection/' + param.id + '/commentCollection');
    this.collData$.subscribe((data: any) => console.log(data));
  }

  closeThread() {
    this.sidenavToggler.threadBar.close();
    this._location.back();
  }
}
