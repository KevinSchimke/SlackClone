import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { SortService } from 'src/app/service/sort/sort.service';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {
  collData$: Observable<any> = EMPTY;
  docData$: Observable<any> = EMPTY;
  collPath: string = '';
  channelId: string = '';
  thread = new Thread();
  threadId: string = '';
  comments: any[] = [];

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private fireService: FirestoreService, private currentDataService: CurrentDataService, private router: Router, private childSelector: SidenavToggleService, private sorter: SortService) { }

  ngOnInit(): void {
    this.subscribeUrl();
    this.subscribeThreadbarInit();
  }

  subscribeUrl(){
    this.route.url.subscribe((params: any) => this.setCommentCollection(params));
  }

  setCommentCollection(params: any){
    this.setChannelAndThreadId(params);
    this.getCollAndDoc();
    this.subscribeCollAndDoc();
  }

  setChannelAndThreadId(params: any){
    this.channelId = params[0].path;
    this.threadId = params[1].path;
  }

  getCollAndDoc() {
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection';
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.docData$ = this.fireService.getDocument(this.threadId,'channels/' + this.channelId + '/ThreadCollection/');
  }

  subscribeThreadbarInit(){
    this.childSelector.threadBarIsInit.subscribe(isLoaded=>{
      if(isLoaded===true)
        this.childSelector.threadBar.open();
    });
  }

  subscribeCollAndDoc(){
    this.docData$.subscribe((thread) => this.subscribeThreadDoc(thread));
    this.collData$.subscribe((comments) => this.comments = this.sorter.sortByDate(comments));
  }

  subscribeThreadDoc(thread: any){
    thread.creationDate = new Date(thread.creationDate.seconds);
    this.thread = thread;
  }

  closeThread() {
    this.sidenavToggler.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }
}
