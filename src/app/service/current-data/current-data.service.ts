import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {

  currentThread = new Thread();
  currentChannel = new Channel();
  users: User[] = [];
  newChatUsers: User[] = [];
  usersAreLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  setChatUsers(users: User[]){
    this.newChatUsers = users;
    console.log(this.newChatUsers);
  }

  setThread(obj: any) {
    this.currentThread.userName = obj.userName;
    this.currentThread.userSrc = obj.userSrc;
    this.currentThread.creationDate = obj.creationDate;
    this.currentThread.message = obj.message;
    this.currentThread.comments = obj.comments;
    // console.log('The cuurent Thread from Service is', this.currentThread);
  }

  setChannel(obj: Channel) {
    this.currentChannel.channelId = obj.channelId;
    this.currentChannel.channelName = obj.channelName;
    this.currentChannel.users = obj.users;
    this.currentChannel.topic = obj.topic;
    this.currentChannel.description = obj.description;
    this.currentChannel.creationDate = obj.creationDate;
    this.currentChannel.creator = obj.creator;
    this.currentChannel.locked = obj.locked;
  }

  setUsers(user_arr: []) {
    this.users = user_arr;
    this.usersAreLoaded.next(true);
  }

  getChatUsers(){
    return this.newChatUsers;
  }

  getThread() {
    return this.currentThread;
  }

  getChannel() {
    return this.currentChannel;
  }

  getUsers(){
    return this.users;
  }

}
