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


  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, public fireService: FirestoreService, private router: Router, private currentDataService: CurrentDataService, private sorter: SortService, private firestore: Firestore) { }

  ngOnInit(): void {
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
    this.collData$.subscribe((threads) => this.setThreads(threads));
  }

  setThreads(threads: []) {
    this.threads = this.sorter.sortByDate(threads);
    this.threads.forEach((thread, k) => {
      let threadPath = 'channels/' + this.channelId + '/ThreadCollection/' + thread.id + '/ReactionCollection';
      let reactionData$ = this.fireService.getCollection(threadPath);
      reactionData$.subscribe((reactions) => {
        this.threads[k]['reactions'] = reactions;
        // console.log(reactions)
      });
    })
  }

  openThread(thread: any) {
    this.sidenavToggler.threadBar.open();
    this.currentDataService.setThread(thread);
    this.router.navigate([{ outlets: { right: [this.channelId, thread.id] } }], { relativeTo: this.route.parent });
  }

  handleClick($event: EmojiEvent, thread: any) {
    // console.log($event);
    // console.log(thread);
    let uids = ['user0'];
    let reaction = new Reaction(uids);
    let collPath = this.collPath + '/' + thread.id + '/ReactionCollection';
    this.fireService.save(reaction, collPath, $event.emoji.native);
  }
}
