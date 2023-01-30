import { Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent {
  collPath: string = '';
  usersToChat: User[] = [];
  allUsers: any[] = [];
  users$: Observable<any> = EMPTY;
  user$: Observable<any> = EMPTY;
  mymodel: any;
  searchUsers = '';

  constructor(private userService: UserService, public firestoreService: FirestoreService, private currentDataService: CurrentDataService, private pushupMessage: PushupMessageService) { }

  async ngOnInit(): Promise<void> {
    this.user$ = this.firestoreService.getUser(this.userService.uid);
    this.users$ = this.firestoreService.getCollection('users');
    this.users$.subscribe((users) => {
      this.allUsers = this.currentDataService.users;
    });
  }

  deleteUserToChat(i: any) {
    const foundIndex = this.usersToChat.indexOf(i);
    this.usersToChat.splice(foundIndex, 1);
    this.currentDataService.setChatUsers(this.usersToChat);
  }

  async valuechange(newValue: any) {
    this.searchUsers = newValue;
  }

  addUser(i: any, input: HTMLInputElement) {
    if (this.usersToChat.includes(i) == false) {
      this.usersToChat.push(i);
      this.currentDataService.setChatUsers(this.usersToChat);
      input.value = '';
      this.searchUsers = '';
    } else {
      this.pushupMessage.openPushupMessage('error', 'User is already in the chat');
    }
  }

}
