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
    this.route.parent?.children[0].params.subscribe((params: any) => this.channelId = params.id);
    this.route.params.subscribe((param: any) => this.getCollAndDoc(param));
  }
  subscribeThreadbarInit(){
    this.childSelector.threadBarIsInit.subscribe(isLoaded=>{
      if(isLoaded===true)
        this.childSelector.threadBar.open();
    });
  }

  getCollAndDoc(param: { id: string }) {
    this.threadId = param.id;
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + param.id + '/commentCollection';
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.docData$ = this.fireService.getDocument(this.threadId,'channels/' + this.channelId + '/ThreadCollection/');
    this.subscribeCollAndDoc();
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
    this.router.navigateByUrl('main/' + this.channelId);
  }
}
