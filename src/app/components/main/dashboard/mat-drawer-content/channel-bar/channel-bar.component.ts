import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { EMPTY, Observable, takeWhile, takeUntil, take } from 'rxjs';
import { collection, deleteDoc, doc, Firestore, limit, limitToLast, onSnapshot, orderBy, Query, query, startAfter, where } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { Channel } from 'src/app/models/channel.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { OpenboxComponent } from 'src/app/components/main/dialogs/openbox/openbox.component';
import { DialogReactionComponent } from '../../../dialogs/dialog-reaction/dialog-reaction.component';
import { BookmarksComponent } from '../bookmarks/bookmarks.component';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  leftSideBar: boolean = false;
  isGoToThreadHovered = false;
  channelId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';
  threads: Thread[] = [];
  channel = new Channel();
  currentUser: User = new User();
  isFirstLoad = true;
  channelName: string = '';
  channel$: Observable<any> = EMPTY;
  shownUsers: string = '';
  loastLoadedThread: Thread = new Thread();
  unsortedThreads: Thread[] = [];
  bookmarks: any[] = [];

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;


  constructor(public dialog: MatDialog, public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, public currentDataService: CurrentDataService, private sorter: SortService, private firestore: Firestore, private userService: UserService) {

  }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.setCurrentChannel(param));
    this.isFirstLoad = true;

  }

  ngAfterViewChecked() {
    if (this.isFirstLoad) {
      this.scrollToBottom();
    }
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.sidenavToggler.workspaceBar.toggle()
  }



  scrolled(event: any): void {
    this.isFirstLoad = false;
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }


  setCurrentChannel(param: { id: string }) {
    this.threads = [];
    this.unsortedThreads = [];
    this.channelId = param.id;
    this.collPath = 'channels/' + param.id + '/ThreadCollection';
    this.snapShotThreadCollection();
    this.isFirstLoad = true;
    this.loadBookmarks();
  }

  snapShotThreadCollection() {
    this.currentDataService.usersAreLoaded$.subscribe(areLoaded => {
      if (areLoaded === true) {
        this.getChannelDoc();
        this.firstQuery(areLoaded);
      }
    });
  }

  firstQuery(areLoaded: boolean) {
    this.threads = [];
    this.unsortedThreads = [];
    const collRef = collection(this.firestore, this.collPath);
    const q = query(collRef, orderBy('creationDate', 'desc'), limit(20));
    this.snapQuery(q);
  }

  nextQuery() {
    const next = query(collection(this.firestore, this.collPath),
      orderBy("creationDate", "desc"),
      startAfter(this.loastLoadedThread),
      limit(20));
    this.snapQuery(next);
  }

  snapQuery(q: Query) {
    const resp = onSnapshot(q, (querySnapshot: any) => {
      querySnapshot.forEach((doc: any) => this.pushIntoThreads(doc));
      this.threads = this.sorter.sortByDate(this.unsortedThreads);
      this.loastLoadedThread = querySnapshot.docs[querySnapshot.docs.length - 1];
    });

    this.currentDataService.snapshot_arr.push(resp);
  }

  pushIntoThreads(doc: any) {
    let elemT = new Thread(this.setThreadFromDoc(doc));
    let i = this.getThreadIndex(elemT);
    if (i != -1)
      this.unsortedThreads.splice(i, 1, elemT);
    else
      this.unsortedThreads.push(elemT);
  }

  setThreadFromDoc(doc: any) {
    let elemT: any = doc.data();
    elemT.id = doc.id;
    elemT.reactions = JSON.parse(elemT.reactions);
    return elemT;
  }

  getThreadIndex(elemT: Thread) {
    return this.unsortedThreads.findIndex((thread: Thread) => thread.id === elemT.id);
  }


  getChannelDoc() {
    this.channel$ = this.fireService.getDocument(this.channelId, 'channels');
    const subscription = this.channel$.subscribe((channel: Channel) => this.channel = channel);
    this.currentDataService.subscription_arr.push(subscription);
  }

  openUserInfoCard(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.router.navigate([{ outlets: { right: ['profile', thread.userId] } }], { relativeTo: this.route.parent });
  }

  openThread(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.router.navigate([{ outlets: { right: [this.channelId, thread.id] } }], { relativeTo: this.route.parent });
  }

  evaluateThread(emoji: string, t: number) {
    if (this.threads[t].getEmojiCount(this.currentUser.id) > 2 && !this.threads[t].isEmojiAlreadyByMe(emoji, this.currentUser.id))
      this.openDialog();
    else
      this.threads[t].evaluateThreadCases(emoji, this.currentUser.id);
    this.saveReaction(t);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogReactionComponent);
    dialogRef.afterClosed().subscribe();
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }

  saveReaction(t: number) {
    this.fireService.save(this.threads[t], 'channels/' + this.channelId + '/ThreadCollection', this.threads[t].id);
  }


  async loadBookmarks() {
    const bookmarksRef = collection(this.firestore, 'channels/' + this.channelId, 'bookmarks');
    const resp = onSnapshot(bookmarksRef, async (bookmarksDocs) => {
      this.bookmarks = [];
      bookmarksDocs.forEach((doc: any) => {
        let bookmarkData = {
          link: '',
          name: '',
          id: '',
        }
        bookmarkData.link = doc.data().link;
        bookmarkData.name = doc.data().name;
        bookmarkData.id = doc.id;
        this.bookmarks.push(bookmarkData);
      })
    })
    this.currentDataService.snapshot_arr.push(resp);
  }

  openBookmarks(channelID: string) {
    let dialog = this.dialog.open(BookmarksComponent);
    dialog.componentInstance.currentChatroomID = channelID;
  }

  async deleteBookmark(deleteBookmarkID: string) {
    await deleteDoc(doc(this.firestore, 'channels/' + this.channelId, 'bookmarks', deleteBookmarkID))
  }
}
