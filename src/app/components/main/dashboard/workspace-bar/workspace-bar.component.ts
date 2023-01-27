import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';
import { SortService } from 'src/app/service/sort/sort.service';
import { User } from 'src/app/models/user.class';
import { onSnapshot } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { Channel } from 'src/app/models/channel.class';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: any[] = [];
  collChannels$: any = EMPTY;

  privates: any[] = [];
  collPrivates$: any = EMPTY;

  currentUser: User = new User();
  username: string = 'valer';
  user$: any = EMPTY;

  users: any[] = [];


  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private sort: SortService, private userService: UserService, public currentData: CurrentDataService) { }

  ngOnInit() {
    this.currentUser = this.userService.get();
    const q1 = this.firestoreService.getCurrentUserData('channels', 'users', this.userService.getUid());
    onSnapshot(q1, (querySnapshot: any) => this.snapShotChannel(querySnapshot));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe();
  }

  snapShotChannel(querySnapshot: any) {
    this.channels = [];
    this.privates = [];
    let k = 0;
    querySnapshot.forEach((doc: any) => k = this.pushIntoChannel(doc, k));
    this.privates = this.channels.filter(this.categoryIsPrivate);
    this.privates = this.sort.sortByName(this.privates);
    this.channels = this.channels.filter(this.categoryIsChannel);
    this.channels = this.sort.sortByName(this.channels);

  }

  categoryIsChannel(channel: Channel){
    return channel.category == 'channel';
  }

  categoryIsPrivate(channel: Channel){
    return channel.category == 'private';
  }

  pushIntoChannel(doc: any, k: number) {
    this.channels.push(doc.data());
    this.channels[k]['id'] = doc.id;
    k++;
    return k;
  }

  snapShotPrivate(querySnapshot: any) {
    this.privates = [];
    let k = 0;
    querySnapshot.forEach((doc: any) => k = this.pushIntoPrivate(doc, k));
    this.sort.sortByName(this.privates);
  }

  pushIntoPrivate(doc: any, k: number) {
    this.privates.push(doc.data());
    this.privates[k]['id'] = doc.id;
    k++;
    return k;
  }
}

// This was in OnInit()
// this.collChannels$ = this.firestoreService.getCollection('channels');
    // this.collChannels$.subscribe((channels: any[]) => this.channels = this.sort.sortByName(channels));
    // this.user$ = this.firestoreService.getUser();
    // this.user$.subscribe(async (user: User) => {
    //   const q = this.firestoreService.getCurrentUserData('privates', 'users', this.username);
    //   const querySnapshot = await getDocs(q);
    //   this.privates = [];
    //   querySnapshot.forEach((doc) => {
    //     this.privates.push(doc.data());
    //     console.log(doc.id, " => ", doc.data());
    //   });
    //   console.log(this.collPrivates$)
    //   this.collPrivates$.subscribe((privates: any[]) => console.log(privates));
    // });
    // console.log('in ', this.currentUser);

    // setTimeout(() => {
    //   console.log('in ', this.currentUser);
    //   console.log('in ', this.currentUser.mail);
    // }, 5000);