import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { SortService } from 'src/app/service/sort/sort.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {
  isGoToThreadHovered = false;
  channelId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';
  threads: any[] = [];
  numberOfLoadMessages: number = 12;
  scrollCounter: number = 0;


  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;
  
  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService, private sorter: SortService) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => this.subscribeCurrentPrivate(param));
  }

  subscribeCurrentPrivate(param: { id: string }) {
    this.channelId = param.id;
    this.collPath = 'privates/' + param.id + '/ThreadCollection'
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.collData$.subscribe((threads: any) => this.threads = this.sorter.sortByDate(threads));
  }

  openThread(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.router.navigate([{ outlets: { right: ['thread',thread.id] } }], { relativeTo: this.route.parent });
  }
}
