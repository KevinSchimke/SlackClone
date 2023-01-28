import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { EMPTY, Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { Channel } from 'src/app/models/channel.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogReactionComponent } from '../dialog-reaction/dialog-reaction.component';
import { OpenboxComponent } from 'src/app/components/openbox/openbox.component';
import { ReactionService } from 'src/app/service/reaction/reaction.service';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent {

  isGoToThreadHovered = false;
  channelId: string = '';
  collData$: Observable<any> = EMPTY;
  collPath: string = '';
  threads: any[] = [];
  channel = new Channel();
  currentUser: User = new User();
  isFirstLoad = true;

  getUserNameById$(id: string) {
    return "";
  }


  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  constructor(public dialog: MatDialog, public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService, private sorter: SortService, private firestore: Firestore, private userService: UserService, private reaction: ReactionService) {

  }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
    this.isFirstLoad = true;
  }

  ngAfterViewChecked() {
    if(this.isFirstLoad){
      this.scrollToBottom();
    }
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


  subscribeCurrentChannel(param: { id: string }) {
    this.channelId = param.id;
    this.collPath = 'channels/' + param.id + '/ThreadCollection'
    this.collData$ = this.fireService.getCollection(this.collPath);
    this.collData$.subscribe((threads) => this.convertThreads(threads));
  }

  convertThreads(threads: []) {
    this.threads = this.sorter.sortByDate(threads);
    this.threads.forEach((thread, k) => {
      this.threads[k].reactions = JSON.parse(thread.reactions);
      this.threads[k].creationDate = this.threads[k].creationDate.toDate();
    });
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

  evaluateThread(emoji: string, thread: Thread, t: number) {
    let userEmojiCount = this.getEmojiCount(thread);
    let emojiIndex = this.getEmojiIndex(emoji, thread);
    let emojiAlreadyByMe = this.isEmojiAlreadyByMe(emoji, thread);
    this.evaluateThreadCases(emoji, thread, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
    this.saveReaction(thread, t);
  }

  getEmojiCount(thread: Thread) {
    return thread.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
  }

  getEmojiIndex(emoji: string, thread: Thread) {
    return thread.reactions.findIndex((reaction) => (reaction.id === emoji));
  }

  isEmojiAlreadyByMe(emoji: string, thread: Thread) {
    return thread.reactions.findIndex((reaction) => (reaction.id === emoji && reaction.users.includes(this.currentUser.id))) != -1;
  }

  evaluateThreadCases(emoji: string, thread: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
    if (emojiAlreadyByMe)
      this.removeReaction(thread, t, emojiIndex);
    else if (userEmojiCount > 2)
      this.openDialog();
    else if (emojiIndex != -1)
      this.addToReaction(emojiIndex, t);
    else if (emojiIndex == -1)
      this.addNewReaction(emoji, t);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogReactionComponent);
    dialogRef.afterClosed().subscribe();
  }

  removeReaction(thread: Thread, t: number, emojiIndex: number) {
    this.threads[t].reactions[emojiIndex].users.splice(thread.reactions[emojiIndex].users.indexOf(this.currentUser.id), 1);
    if (this.threads[t].reactions[emojiIndex].users.length == 0) {
      this.threads[t].reactions.splice(emojiIndex, 1);
    }
  }

  addNewReaction(emoji: string, t: number) {
    this.threads[t].reactions.push({
      id: emoji,
      users: [this.currentUser.id]
    });
  }

  addToReaction(emojiIndex: number, t: number){
    this.threads[t].reactions[emojiIndex].users.push(this.currentUser.id);
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }

  saveReaction(thread: Thread, t: number){
    let updatedThread = new Thread(this.threads[t]);
    this.fireService.save(updatedThread, 'channels/' + this.channelId + '/ThreadCollection', thread.id);
  }
}
