import { Injectable } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {

  currentThread = new Thread();
  currentChannel = new Channel();
  currentUser = new User();

  constructor() { }

  setThread(obj: any) {
    this.currentThread.userName = obj.userName;
    this.currentThread.userSrc = obj.userSrc;
    this.currentThread.creationDate = obj.creationDate.toDate();
    this.currentThread.message = obj.message;
    this.currentThread.comments = obj.comments;
    console.log('The cuurent Thread from Service is', this.currentThread);
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

  setUser(obj: User) {
    this.currentUser.id = obj.id;
    this.currentUser.name = obj.name;
    this.currentUser.mail = obj.mail;
    this.currentUser.telephone = obj.telephone;
    this.currentUser.src = obj.src;
    this.currentUser.state = obj.state;
    this.currentUser.status = obj.status;
    this.currentUser.lastLogin = obj.lastLogin;
    this.currentUser.creationDate = obj.creationDate;
    console.log('The cuurent User from Service is', this.currentUser);
  }

  getThread() {
    return this.currentThread;
  }

  getChannel() {
    return this.currentChannel;
  }

  getUser() {
    return this.currentUser;
  }

}
