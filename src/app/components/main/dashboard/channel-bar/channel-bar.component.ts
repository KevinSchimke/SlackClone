import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { EMPTY, Observable } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  isGoToThreadHovered = false;
  channelId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';
  threads: any[] = [];
  

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }


  subscribeCurrentChannel(param: { id: string }) {
    this.channelId = param.id;
    this.currentDataService.setChannelId(this.channelId);
    this.collPath = 'channels/' + param.id + '/ThreadCollection'
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.collData$.subscribe((threads) => this.sortThreads(threads));
  }

  sortThreads(threads: any[]){
    let self = this;
    this.threads = threads.sort(function(a: {creationDate:Timestamp}, b: {creationDate:Timestamp}) {
      return self.compareStrings(a.creationDate.seconds, b.creationDate.seconds);
    });
  }

  compareStrings(a: number, b: number) {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  openThread(thread: any){
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.currentDataService.setChannelId(this.channelId);
    this.router.navigate([{outlets:{right: ['thread',thread.id]}}],{relativeTo : this.route.parent});
  }
}
