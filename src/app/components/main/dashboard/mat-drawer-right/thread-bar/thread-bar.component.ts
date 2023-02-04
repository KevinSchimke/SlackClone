import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EMPTY, Observable } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { OpenboxComponent } from 'src/app/components/main/dialogs/openbox/openbox.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogReactionComponent } from '../../../dialogs/dialog-reaction/dialog-reaction.component';
import { Channel } from 'src/app/models/channel.class';
import { collection, Firestore, limit, onSnapshot, orderBy, Query, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-thread-bar',
  templateUrl: './thread-bar.component.html',
  styleUrls: ['./thread-bar.component.scss']
})
export class ThreadBarComponent {
  collData$: Observable<any> = EMPTY;
  threadDocData$: Observable<any> = EMPTY;
  channelDocData$: Observable<any> = EMPTY;
  collPath: string = '';
  channel: Channel = new Channel();
  channelId: string = '';
  thread = new Thread();
  threadId: string = '';
  comments: Thread[] = [];
  unsortedComments: Thread[] = [];
  currentUser = new User();
  loastLoadedComment: Thread = new Thread();
  isFirstLoad = true;

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;


  constructor(private route: ActivatedRoute, private fireService: FirestoreService, public currentDataService: CurrentDataService, private router: Router, private childSelector: SidenavToggleService, private sorter: SortService, private userService: UserService, private dialog: MatDialog, private firestore: Firestore) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.subscribeUrl();
    this.subscribeThreadbarInit();
    this.isFirstLoad = true;
  }

  scrolled(event: any): void {
    this.isFirstLoad = false;
  }

  ngAfterViewChecked() {
    if (this.isFirstLoad) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  subscribeUrl() {
    this.route.url.subscribe((params: any) => this.setCommentCollection(params));
  }

  setCommentCollection(params: any) {
    this.setChannelAndThreadId(params);
    this.getCollAndDoc();
    this.subscribeCollAndDoc();
  }

  setChannelAndThreadId(params: any) {
    this.channelId = params[0].path;
    this.threadId = params[1].path;
    this.comments = [];
    this.unsortedComments = [];
  }

  getCollAndDoc() {
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection';
    this.threadDocData$ = this.fireService.getDocument(this.threadId, 'channels/' + this.channelId + '/ThreadCollection/');
    this.channelDocData$ = this.fireService.getDocument(this.channelId, 'channels/');
  }

  subscribeThreadbarInit() {
    this.childSelector.threadBarIsInit.subscribe(isLoaded => {
      if (isLoaded === true)
        this.childSelector.threadBar.open();
    });
  }

  subscribeCollAndDoc() {
    const subscription_thread = this.threadDocData$.subscribe((thread) => this.setThread(thread));
    const subscription_channel = this.channelDocData$.subscribe((channel) => this.channel = channel);
    this.currentDataService.subscription_arr.push(subscription_thread);
    this.currentDataService.subscription_arr.push(subscription_channel);
    this.snapShotThreadCollection();
  }

  setThread(thread: Thread) {
    this.thread = thread;
    this.currentDataService.setThread(thread);
  }

  snapShotThreadCollection() {
    this.currentDataService.usersAreLoaded$.subscribe(areLoaded => {
      this.firstQuery(areLoaded)
    });
  }

  firstQuery(areLoaded: boolean) {
    if (areLoaded === true) {
      this.comments = [];
      this.unsortedComments = [];
      const collRef = collection(this.firestore, this.collPath);
      const q = query(collRef, orderBy('creationDate', 'desc'), limit(12));
      this.snapQuery(q);
    }
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: any) => {
      querySnapshot.forEach((doc: any) => this.pushIntoThreads(doc));
      this.comments = this.sorter.sortByDate(this.unsortedComments);
      this.loastLoadedComment = querySnapshot.docs[querySnapshot.docs.length - 1];
    });
    this.currentDataService.snapshot_arr.push(resp);
  }

  pushIntoThreads(doc: any) {
    let elemT = new Thread(this.setThreadFromDoc(doc));
    let i = this.getThreadIndex(elemT);
    if (i != -1)
      this.unsortedComments.splice(i, 1, elemT);
    else
      this.unsortedComments.push(elemT);
  }

  setThreadFromDoc(doc: any) {
    let elemT: any = doc.data();
    elemT.id = doc.id;
    elemT.reactions = JSON.parse(elemT.reactions);
    return elemT;
  }

  getThreadIndex(elemT: Thread) {
    return this.unsortedComments.findIndex((thread: Thread) => thread.id === elemT.id);
  }

  closeThread() {
    this.childSelector.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }

  evaluateThread(emoji: string, c: number) {
    if (this.comments[c].getEmojiCount(this.currentUser.id) > 2 && !this.comments[c].isEmojiAlreadyByMe(emoji, this.currentUser.id))
      this.openDialog();
    else
      this.comments[c].evaluateThreadCases(emoji, this.currentUser.id);
    this.saveReaction(c);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogReactionComponent);
    dialogRef.afterClosed().subscribe();
  }

  saveReaction(c: number) {
    this.fireService.save(this.comments[c], 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection', this.comments[c].id);
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }

  openUserInfoCard(thread: any) {
    this.childSelector.threadBar.open();
    this.router.navigate([{ outlets: { right: ['profile', thread.userId] } }], { relativeTo: this.route.parent });
  }
}
