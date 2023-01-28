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
  privates: any[] = [];

  constructor() { }

  setChatUsers(users: User[]) {
    this.newChatUsers = users;
    // console.log(this.newChatUsers);
  }

  setPrivates(privates: any[]){
    this.privates = privates;
  }

  setThread(obj: any) {
    this.currentThread.id = obj.id;
    this.currentThread.userId = obj.userId;
    this.currentThread.creationDate = obj.creationDate;
    this.currentThread.message = obj.message;
    this.currentThread.comments = obj.comments;
    this.currentThread.lastComment = obj.lastComment;
    this.currentThread.img = obj.img;
    this.currentThread.reactions = obj.reactions;
    this.currentThread.users = obj.users;
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
  }

  getChatUsers() {
    return this.newChatUsers;
  }

  getChatUsersId(){
    let ids: string[] = [];
    this.newChatUsers.forEach(user => ids.push(user.id));
    return ids;
  }

  getThread() {
    return this.currentThread;
  }

  getChannel() {
    return this.currentChannel;
  }

  getUsers() {
    return this.users;
  }

  getPrivates(){
   return this.privates;
  }

}
