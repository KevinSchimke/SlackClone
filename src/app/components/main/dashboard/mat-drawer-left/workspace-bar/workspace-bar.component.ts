import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { DialogAddChannelComponent } from '../../../dialogs/dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';
import { SortService } from 'src/app/service/sort/sort.service';
import { User } from 'src/app/models/user.class';
import { onSnapshot } from '@angular/fire/firestore';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { Channel } from 'src/app/models/channel.class';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: Channel[] = [];
  collChannels$: any = EMPTY;

  privates: Channel[] = [];
  collPrivates$: any = EMPTY;

  currentUser: User = new User();
  username: string = 'valer';
  user$: any = EMPTY;

  users: any[] = [];
  userActive = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private sort: SortService, private userService: UserService, public currentData: CurrentDataService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public sidenav: SidenavToggleService) {
    this.mobileQuery = media.matchMedia('(max-width: 500px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.currentUser = this.userService.get();
    this.currentData.usersAreLoaded$.subscribe((areLoaded) => {
      if (areLoaded) {
        this.users = this.currentData.users;
      }
    })
    const q1 = this.firestoreService.getCurrentUserData('channels', 'users', this.userService.getUid());
    const resp = onSnapshot(q1, (querySnapshot: any) => this.snapShotChannel(querySnapshot));
    this.currentData.snapshot_arr.push(resp);
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent);
  }

  snapShotChannel(querySnapshot: any) {
    this.channels = [];
    this.privates = [];
    querySnapshot.forEach((doc: any) => this.pushIntoChannel(doc));
    this.setChannelsAndPrivates();
  }

  setChannelsAndPrivates() {
    this.currentData.setAllChannels(this.channels);
    this.privates = this.channels.filter(this.categoryIsPrivate);
    this.privates = this.sort.sortByName(this.privates);
    this.channels = this.channels.filter(this.categoryIsChannel);
    this.channels = this.sort.sortByName(this.channels);
    this.currentData.setPrivates(this.privates);
    this.currentData.setChannels(this.channels);
  }

  // getUser(uid: string) {
  //   this.currentData.usersAreLoaded$.subscribe(isLoaded => {
  //     if (isLoaded === true) {
  //       this.userActive = this.userService.userState(this.user);
  //     }
  //   });
  // }

  categoryIsChannel(channel: Channel) {
    return channel.category == 'channel';
  }

  categoryIsPrivate(channel: Channel) {
    return channel.category == 'private';
  }

  pushIntoChannel(doc: any) {
    let channel = new Channel(doc.data());
    channel.channelId = doc.id;
    this.channels.push(channel);
  }

  isUserActive(msgUsers: string[], allUsers: any[]) {
    let user: any;
    msgUsers.forEach((uid) => {
      let foundUser: any = allUsers.find((user: any) => (user.id === uid && uid !== this.currentUser.id));
      if (foundUser) {
        user = foundUser;
      }
    });
    if (msgUsers.length == 2 && msgUsers[0] === msgUsers[1]) {
      return this.userService.userState(this.currentUser);
    } else if (user) {
      if (!(user.lastLogin instanceof Date)) user.lastLogin = user.lastLogin.toDate();
      return this.userService.userState(user);
    }
    else
      return false;
  }

  toggleSidenav(){
    if(this.mobileQuery.matches)
      this.sidenav.workspaceBar.toggle();
  }

}