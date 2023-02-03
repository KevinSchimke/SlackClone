import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
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

  constructor(public dialog: MatDialog,public sidenavToggler: SidenavToggleService, private firestore: Firestore, private userService: UserService, private sorter: SortService) { }

  async ngOnInit() {
    let channelsRef = collection(this.firestore, 'channels');
    const openChannelsQuery = query(channelsRef, where("locked", "==", false));
    const joinedChannelsQuery = query(channelsRef, where("users", "array-contains", this.userService.getUid()), where("category", "==", 'channel'));
    const [isOpenChannels, isJoinedChannels] = await Promise.all([
      await getDocs(openChannelsQuery),
      await getDocs(joinedChannelsQuery)
    ]);
    this.setChannelArr(isOpenChannels,isJoinedChannels);
  }

  openDialog(): void {
    this.dialog.open(DialogAddChannelComponent);
  }

  setChannelArr(isOpenChannels: any,isJoinedChannels: any){
    this.preChannelArr = [];
    isOpenChannels.forEach((doc: any) => this.addToChannel(doc));
    isJoinedChannels.forEach((doc: any) => this.addToChannel(doc));
    this.channels = this.preChannelArr.filter((elem, i) => {
      return this.preChannelArr.findIndex((channel) => channel.channelId === elem.channelId) === i;
    });
    this.channels = this.sorter.sortByDate(this.channels);
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
}
