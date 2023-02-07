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
import { collection, deleteDoc, doc, DocumentData, Firestore, getDocs, limit, onSnapshot, orderBy, Query, query, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { QueryProcessService } from 'src/app/service/query-process/query-process.service';

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
  bookmarks: Thread[] = [];
  unsortedBookmarks: Thread[] = [];
  currentUser = new User();
  lastLoadedBookmark!: QueryDocumentSnapshot<DocumentData>;
  isFirstLoad = true;

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;


  constructor(private route: ActivatedRoute, private fireService: FirestoreService, public currentDataService: CurrentDataService, private router: Router, private childSelector: SidenavToggleService, private sorter: SortService, private userService: UserService, private dialog: MatDialog, private firestore: Firestore, private queryProcessService: QueryProcessService) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.setCommentCollection();
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


  setCommentCollection() {
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
      this.bookmarks = [];
      this.unsortedBookmarks = [];
      const q = this.fireService.getLimitedQuery(this.collPath);
      this.snapQuery(q);
    }
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      [this.bookmarks, this.lastLoadedBookmark] = this.queryProcessService.processQuery(querySnapshot, this.unsortedBookmarks);
    });
    this.currentDataService.snapshot_arr.push(resp);
  }

  closeThread() {
    this.childSelector.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }

  evaluateThread(emoji: string, c: number) {
    if (this.bookmarks[c].getEmojiCount(this.currentUser.id) > 2 && !this.bookmarks[c].isEmojiAlreadyByMe(emoji, this.currentUser.id))
      this.openDialog();
    else
      this.bookmarks[c].evaluateThreadCases(emoji, this.currentUser.id);
    this.saveReaction(c);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogReactionComponent);
    dialogRef.afterClosed().subscribe();
  }

  saveReaction(c: number) {
    this.fireService.save(this.bookmarks[c], 'users/' + this.userService.getUid() + '/bookmarks', this.bookmarks[c].id);
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
    this.setCommentCollection();
  }


}
