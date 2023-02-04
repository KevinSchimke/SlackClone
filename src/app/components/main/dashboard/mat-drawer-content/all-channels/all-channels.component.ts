import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { Channel } from 'src/app/models/channel.class';
import { SortService } from 'src/app/service/sort/sort.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../../../dialogs/dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html',
  styleUrls: ['./all-channels.component.scss']
})
export class AllChannelsComponent {
  leftSideBar: boolean = false;
  preChannelArr: Channel[] = [];
  channels: Channel[] = [];
  currentUserId: string = '';
  isActive = true;

  constructor(public dialog: MatDialog, public sidenavToggler: SidenavToggleService, private firestore: Firestore, private userService: UserService, private sorter: SortService, public firestoreService: FirestoreService) { }

  async ngOnInit() {
    this.currentUserId = this.userService.getUid();
    let channelsRef = collection(this.firestore, 'channels');
    const openChannelsQuery = query(channelsRef, where("locked", "==", false));
    const joinedChannelsQuery = query(channelsRef, where("users", "array-contains", this.currentUserId), where("category", "==", 'channel'));
    const createdChannelsQuery = query(channelsRef, where("creator", "==", this.currentUserId)); //If you accidentally leave your own locked channel, it does not get lost
    const [isOpenChannels, isJoinedChannels, isCreatorOfChannels] = await Promise.all([
      await getDocs(openChannelsQuery),
      await getDocs(joinedChannelsQuery),
      await getDocs(createdChannelsQuery)
    ]);
    this.setChannelArr(isOpenChannels, isJoinedChannels, isCreatorOfChannels);
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent);
  }

  setChannelArr(isOpenChannels: any, isJoinedChannels: any, isCreatorOfChannels: any) {
    this.preChannelArr = [];
    isOpenChannels.forEach((doc: any) => this.addToChannel(doc));
    isJoinedChannels.forEach((doc: any) => this.addToChannel(doc));
    isCreatorOfChannels.forEach((doc: any) => this.addToChannel(doc));
    this.channels = this.preChannelArr.filter((elem, i) => {
      return this.preChannelArr.findIndex((channel) => channel.channelId === elem.channelId) === i;
    });
    this.channels = this.sorter.sortByName(this.channels);
    // console.log(this.preChannelArr);
    // console.log(this.channels);
  }

  addToChannel(doc: any) {
    let channelElement = new Channel(doc.data());
    channelElement.channelId = doc.id;
    this.preChannelArr.push(channelElement);
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.sidenavToggler.workspaceBar.toggle()
  }

  isInChannel(channel:Channel){
    return channel.users.indexOf(this.currentUserId) !== -1;
  }

  addUserToChannel(c: number){
    this.channels[c].users.push(this.currentUserId);
    this.firestoreService.pushUserToChannel(this.channels[c].channelId,this.currentUserId);
  }

  removeUserFromChannel(c: number){
    this.channels[c].users.splice(this.channels[c].users.indexOf(this.currentUserId),1);
    this.firestoreService.removeUserFromChannel(this.channels[c].channelId,this.currentUserId);
  }
}
