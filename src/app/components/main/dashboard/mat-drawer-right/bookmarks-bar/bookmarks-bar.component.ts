import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
import { collection, deleteDoc, doc, Firestore, getDocs, limit, onSnapshot, orderBy, Query, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks-bar.component.html',
  styleUrls: ['./bookmarks-bar.component.scss']
})
export class BookmarksBarComponent {
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

  bookmarks: any[] = [];

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
    this.getCollAndDoc();
    this.snapShotThreadCollection();
  }


  async getCollAndDoc() {
    this.collPath = 'users/' + this.userService.getUid() + '/bookmarks';
  }

  subscribeThreadbarInit() {
    this.childSelector.threadBarIsInit.subscribe(isLoaded => {
      if (isLoaded === true)
        this.childSelector.threadBar.open();
    });
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
      const q = query(collRef, orderBy('creationDate'), limit(12));
      this.snapQuery(q);
    }
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: any) => {
      querySnapshot.forEach((doc: any) => this.pushIntoThreads(doc));
      this.comments = this.sorter.sortByDate(this.unsortedComments);
      console.log(this.comments);

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

  async deleteBookmark(deleteBookmarkID: string) {
    await deleteDoc(doc(this.firestore, 'users/' + this.userService.getUid() + '/bookmarks', deleteBookmarkID));
  }


}
