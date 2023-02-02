import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { UserService } from 'src/app/service/user/user.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

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
    // const isOpenChannelsArray = isOpenChannels.doc;
    //     const isJoinedChannelsArray = isJoinedChannels.docs;

    // const channelsArray = isOpenChannelsArray.concat(isJoinedChannelsArray);
  }


  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.sidenavToggler.workspaceBar.toggle()
  }
}
