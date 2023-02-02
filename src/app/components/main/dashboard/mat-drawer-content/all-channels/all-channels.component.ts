import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { Channel } from 'src/app/models/channel.class';

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html',
  styleUrls: ['./all-channels.component.scss']
})
export class AllChannelsComponent {
  leftSideBar: boolean = false;

  constructor(public sidenavToggler: SidenavToggleService, private firestore: Firestore, private userService: UserService, private firestoreService: FirestoreService) { }

  async ngOnInit() {
    let channelsRef = collection(this.firestore, 'channels');
    const openChannelsQuery = query(channelsRef, where("locked", "==", false));
    const joinedChannelsQuery = this.firestoreService.getCurrentUserData('channels', 'users', this.userService.getUid());
    const [isOpenChannels, isJoinedChannels] = await Promise.all([
      await getDocs(openChannelsQuery),
      await getDocs(joinedChannelsQuery)
    ]);
    console.log('openChannels are ', isOpenChannels);
    let channelsArray: Channel[] = [];
    isOpenChannels.forEach((doc) => {
      let channelElement = new Channel(doc.data());
      channelElement.channelId = doc.id;
      channelsArray.push(channelElement);
    });
    // const isOpenChannelsArray = isOpenChannels.doc;
    //     const isJoinedChannelsArray = isJoinedChannels.docs;

    // const channelsArray = isOpenChannelsArray.concat(isJoinedChannelsArray);
  }

  // pushIntoChannels(doc: any) {
  //   let elemT = new Thread(this.setThreadFromDoc(doc));
  //   let i = this.getThreadIndex(elemT);
  //   if (i != -1)
  //     this.unsortedThreads.splice(i, 1, elemT);
  //   else
  //     this.unsortedThreads.push(elemT);
  // }

  // setChannelFromDoc(doc: any) {
  //   let elemT: any = doc.data();
  //   elemT.id = doc.id;
  //   elemT.reactions = JSON.parse(elemT.reactions);
  //   return elemT;
  // }


  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.sidenavToggler.workspaceBar.toggle()
  }
}
