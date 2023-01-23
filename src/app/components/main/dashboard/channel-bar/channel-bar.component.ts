import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { EMPTY, Observable } from 'rxjs';
import { collection, doc, Firestore, setDoc, Timestamp } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { SortService } from 'src/app/service/sort/sort.service';
import { Channel } from 'src/app/models/channel.class';
import { Private } from 'src/app/models/private.class';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Thread } from 'src/app/models/thread.class';
import { Reaction } from 'src/app/models/reaction.class';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { ThreadBarComponent } from '../thread-bar/thread-bar.component';

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
  channel = new Private();
  currentUser: User = new User();


  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService, private sorter: SortService, private firestore: Firestore, private userService: UserService) {

  }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  ngAfterViewChecked() {
    // if (this.numberOfLoadMessages == 12 && this.scrollCounter == 0) {
    this.scrollToBottom();
    this.scrollCounter++
    // }
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
    this.threads.forEach( (thread, k) => {
      this.threads[k].reactions = JSON.parse(thread.reactions);
      this.threads[k].creationDate = this.threads[k].creationDate.toDate();
    });
  }

  openThread(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.router.navigate([{ outlets: { right: [this.channelId, thread.id] } }], { relativeTo: this.route.parent });
  }

  handleClick($event: EmojiEvent, thread: Thread, t: number) {
    this.evaluateThread($event, thread, t);
  }

  evaluateThread($event: EmojiEvent, thread: Thread, t: number) {
    let userEmojiCount = thread.reactions.filter((reaction) => (reaction.users.includes(this.currentUser.id))).length;
    let emojiIndex = thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native));
    let emojiAlreadyByMe = thread.reactions.findIndex((reaction) => (reaction.id === $event.emoji.native && reaction.users.includes(this.currentUser.id)));
    if (emojiAlreadyByMe != -1) {
      this.threads[t].reactions[emojiIndex].users.splice(thread.reactions[emojiIndex].users.indexOf(this.currentUser.id), 1);
      if(this.threads[t].reactions[emojiIndex].users.length == 0){
        this.threads[t].reactions.splice(emojiIndex,1);
      }
    } else if (userEmojiCount > 2) {
      // Open Dialog 
      alert('Hier kommt ein Dialog hin. Vorerst: KONTROLL MAL DEINE EMOTIONEN!!!');
    } else if (emojiIndex != -1) {
      this.threads[t].reactions[emojiIndex].users.push(this.currentUser.id);
    } else if (emojiIndex == -1) {
      this.threads[t].reactions.push({
        id: $event.emoji.native,
        users: [this.currentUser.id]
      });
    }
    console.log('userid des threads ',this.threads[t]);
    let updatedThread = new Thread(this.threads[t]);
    if (updatedThread.comments == undefined) {
      updatedThread.comments = 0;
    }
    if (updatedThread.lastComment == undefined) {
      updatedThread.lastComment = updatedThread.creationDate;
    }
    
    this.fireService.save(updatedThread,'channels/'+this.channelId + '/ThreadCollection',thread.id);
    console.log('Aktualisierte Reactions sind: ',thread.reactions);
  }
}
