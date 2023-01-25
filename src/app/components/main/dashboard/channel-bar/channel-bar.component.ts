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
import { OpenboxComponent } from 'src/app/openbox/openbox.component';
import { ReactionService } from 'src/app/service/reaction/reaction.service';

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
  numberOfLoadMessages: number = 12;
  scrollCounter: number = 0;
  channel = new Channel();
  currentUser: User = new User();


  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  constructor(public dialog: MatDialog, public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService, private sorter: SortService, private firestore: Firestore, private userService: UserService, private reaction: ReactionService) {

  }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  ngAfterViewChecked() {
    if (this.numberOfLoadMessages == 12 && this.scrollCounter == 0) {
    this.scrollToBottom();
    this.scrollCounter++
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
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

  openThread(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.router.navigate([{ outlets: { right: [this.channelId, thread.id] } }], { relativeTo: this.route.parent });
  }

  evaluateThread($event: EmojiEvent, thread: Thread, t: number) {
    let userEmojiCount = this.getEmojiCount(thread);
    let emojiIndex = this.getEmojiIndex($event, thread);
    let emojiAlreadyByMe = this.isEmojiAlreadyByMe($event, thread);
    this.evaluateThreadCases($event, thread, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
    let updatedThread = new Thread(this.threads[t]);
    this.fireService.save(updatedThread, 'channels/' + this.channelId + '/ThreadCollection', thread.id);
  }

  getEmojiCount(thread: Thread) {
    return thread.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
  }

  getEmojiIndex($event: EmojiEvent, thread: Thread) {
    return thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native));
  }

  isEmojiAlreadyByMe($event: EmojiEvent, thread: Thread) {
    return thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native && reaction.users.includes(this.currentUser.id))) != -1;
  }

  evaluateThreadCases($event: EmojiEvent, thread: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
    if (emojiAlreadyByMe)
      this.removeReaction(thread, t, emojiIndex);
    else if (userEmojiCount > 2)
      this.openDialog();
    else if (emojiIndex != -1)
      this.threads[t].reactions[emojiIndex].users.push(this.currentUser.id);
    else if (emojiIndex == -1)
      this.addNewReaction($event, t);
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

  addNewReaction($event: EmojiEvent, t: number) {
    this.threads[t].reactions.push({
      id: $event.emoji.native,
      users: [this.currentUser.id]
    });
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }
}
