import { Component } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore/firestore.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent {
  collPath: string = '';
  usersToChat: User[] = [];
  allUsers: User[] = [];
  mymodel: any;
  searchUsers = '';
  leftSideBar: boolean = false;

  constructor(public firestoreService: FirestoreService, private currentDataService: CurrentDataService, private pushupMessage: PushupMessageService, private sidenavToggler: SidenavToggleService) { }

  async ngOnInit(): Promise<void> {
    this.currentDataService.usersAreLoaded$.subscribe((areLoaded) => {
      if (areLoaded) {
        this.allUsers = this.currentDataService.users;
      }
    })

  }

  deleteUserToChat(user: User) {
    const foundIndex = this.usersToChat.indexOf(user);
    this.usersToChat.splice(foundIndex, 1);
    this.currentDataService.setChatUsers(this.usersToChat);
  }

  async valuechange(newValue: any) {
    this.searchUsers = newValue;
  }

  addUser(user: User, input: HTMLInputElement) {
    if (!this.usersToChat.includes(user)) {
      this.usersToChat.push(user);
      this.currentDataService.setChatUsers(this.usersToChat);
      input.value = '';
      this.searchUsers = '';
    } else {
      this.pushupMessage.openPushupMessage('error', 'User is already in the chat');
    }
  }

  toggleLeftSidebar() {
    this.leftSideBar = !this.leftSideBar;
    this.sidenavToggler.workspaceBar.toggle()
  }

}
