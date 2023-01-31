import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EMPTY, Observable } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { OpenboxComponent } from 'src/app/components/main/dialogs/openbox/openbox.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogReactionComponent } from '../../../dialogs/dialog-reaction/dialog-reaction.component';
import { Channel } from 'src/app/models/channel.class';

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
  comments: any[] = [];
  currentUser = new User();

  constructor(private route: ActivatedRoute, private fireService: FirestoreService, public currentDataService: CurrentDataService, private router: Router, private childSelector: SidenavToggleService, private sorter: SortService, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.subscribeUrl();
    this.subscribeThreadbarInit();
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
  }

  getCollAndDoc() {
    this.collPath = 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection';
    this.collData$ = this.fireService.getCollection(this.collPath);
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
    this.threadDocData$.subscribe((thread) => this.setThread(thread));
    this.collData$.subscribe((comments) => this.setComments(comments));
    this.channelDocData$.subscribe((channel) => this.channel = channel);
  }

  setThread(thread: Thread) {
    this.thread = thread;
    this.currentDataService.setThread(thread);
  }

  setComments(comments: any[]) {
    this.comments = this.sorter.sortByDate(comments);
    this.comments.forEach((comment, k) => {
      this.comments[k].reactions = JSON.parse(comment.reactions);
      this.comments[k].creationDate = this.comments[k].creationDate.toDate();
    });
  }

  closeThread() {
    this.childSelector.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }

  evaluateThread(emoji: string, comment: Thread, t: number) {
    let userEmojiCount = this.getEmojiCount(comment);
    let emojiIndex = this.getEmojiIndex(emoji, comment);
    let emojiAlreadyByMe = this.isEmojiAlreadyByMe(emoji, comment);
    this.evaluateThreadCases(emoji, comment, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
    this.saveReaction(comment, t);
  }

  getEmojiCount(comment: Thread) {
    return comment.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
  }

  getEmojiIndex(emoji: string, comment: Thread) {
    return comment.reactions.findIndex((reaction) => (reaction.id === emoji));
  }

  isEmojiAlreadyByMe(emoji: string, comment: Thread) {
    return comment.reactions.findIndex((reaction) => (reaction.id === emoji && reaction.users.includes(this.currentUser.id))) != -1;
  }

  evaluateThreadCases(emoji: string, comment: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
    if (emojiAlreadyByMe)
      this.removeReaction(comment, t, emojiIndex);
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

  removeReaction(comment: Thread, t: number, emojiIndex: number) {
    this.comments[t].reactions[emojiIndex].users.splice(comment.reactions[emojiIndex].users.indexOf(this.currentUser.id), 1);
    if (this.comments[t].reactions[emojiIndex].users.length == 0) {
      this.comments[t].reactions.splice(emojiIndex, 1);
    }
  }

  addNewReaction(emoji: string, t: number) {
    this.comments[t].reactions.push({
      id: emoji,
      users: [this.currentUser.id]
    });
  }

  addToReaction(emojiIndex: number, t: number) {
    this.comments[t].reactions[emojiIndex].users.push(this.currentUser.id);
  }

  saveReaction(comment: Thread, t: number) {
    let updatedThread = new Thread(this.comments[t]);
    this.fireService.save(updatedThread, 'channels/' + this.channelId + '/ThreadCollection/'+ this.threadId + '/commentCollection', comment.id);
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }
}
