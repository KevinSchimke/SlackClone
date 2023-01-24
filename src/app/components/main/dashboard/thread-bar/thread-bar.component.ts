import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { OpenboxComponent } from 'src/app/openbox/openbox.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { UserService } from 'src/app/service/user/user.service';
import { DialogReactionComponent } from '../dialog-reaction/dialog-reaction.component';

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
  currentUser = new User();

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private fireService: FirestoreService, private currentDataService: CurrentDataService, private router: Router, private childSelector: SidenavToggleService, private sorter: SortService, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
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
    this.docData$.subscribe((thread) => this.thread = thread);
    this.collData$.subscribe((comments) => {
      this.comments = this.sorter.sortByDate(comments);
      this.comments.forEach((comment, k) => {
        this.comments[k].reactions = JSON.parse(comment.reactions);
        this.comments[k].creationDate = this.comments[k].creationDate.toDate();
      });
    });
  }

  closeThread() {
    this.sidenavToggler.threadBar.close();
    this.router.navigate([{ outlets: { right: null } }], { relativeTo: this.route.parent });
  }

  evaluateThread($event: EmojiEvent, comment: Thread, t: number) {
    console.log('Comment is ',comment);
    let userEmojiCount = comment.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
    let emojiIndex = comment.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native));
    let emojiAlreadyByMe = comment.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native && reaction.users.includes(this.currentUser.id))) != -1;
    this.evaluateThreadCases($event, comment, t, userEmojiCount, emojiIndex, emojiAlreadyByMe);
    let updatedThread = new Thread(this.comments[t]);
    this.fireService.save(updatedThread, 'channels/' + this.channelId + '/ThreadCollection/' + this.threadId + '/commentCollection', comment.id);
  }

  evaluateThreadCases($event: EmojiEvent, comment: Thread, t: number, userEmojiCount: number, emojiIndex: number, emojiAlreadyByMe: boolean) {
    if (emojiAlreadyByMe)
      this.removeReaction(comment, t, emojiIndex);
    else if (userEmojiCount > 2)
      this.openDialog();
    else if (emojiIndex != -1)
      this.comments[t].reactions[emojiIndex].users.push(this.currentUser.id);
    else if (emojiIndex == -1)
      this.addNewReaction($event, t);
  }

  // test($event: EmojiEvent, comment: Thread, t: number){
  //   let updatedThread = this.reaction.evaluateThread($event, comment, t, this.channelId);

  // }

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

  addNewReaction($event: EmojiEvent, t: number) {
    this.comments[t].reactions.push({
      id: $event.emoji.native,
      users: [this.currentUser.id]
    });
  }

  openBox(url: string) {
    let dialog = this.dialog.open(OpenboxComponent);
    dialog.componentInstance.openboxImg = url;
  }
}
