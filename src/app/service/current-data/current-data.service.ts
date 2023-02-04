import { Injectable } from '@angular/core';
import { Unsubscribe } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {
  snapshot_arr: Unsubscribe[] = [];
  subscription_arr: Subscription[] = [];
  interval_arr: NodeJS.Timer[] = [];

  currentThread = new Thread();
  currentChannel = new Channel();
  users: User[] = [];
  newChatUsers: User[] = [];
  privates: any[] = [];
  allCategories: any[] = [];
  channelsAreLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  usersAreLoaded: boolean = false;
  usersAreLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  onceSubscribtedUsers: User[] = [];

  constructor(private userService: UserService) { }

  clearByLogout() {
    this.snapshot_arr.forEach((unsub) => unsub());
    this.subscription_arr.forEach((sub) => sub.unsubscribe());
    this.interval_arr.forEach((int, i) => window.clearInterval(i));
  }

  pushToSnapshots(snap: Unsubscribe) {
    this.snapshot_arr.push(snap);
  }

  pushToSubscription(sub: Subscription) {
    this.subscription_arr.push(sub);
  }

  pushToInterval(int: NodeJS.Timer) {
    this.interval_arr.push(int);
  }

  setChatUsers(users: User[]) {
    this.newChatUsers = users;
  }

  setPrivates(privates: any[]) {
    this.privates = privates;
  }

  setChannels(channels: any[]) {
    this.allCategories = channels;
    this.channelsAreLoaded.next(true);
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
    let user: any = user_arr.find((user: User) => user.id === this.userService.uid);
    if (user) {
      this.userService.set(user);
    } else {
      console.log('gefunden');
    }
    if (!this.usersAreLoaded) {
      this.onceSubscribtedUsers = user_arr;
      this.usersAreLoaded = true;
      this.usersAreLoaded$.next(true);
    }
  }

  getChatUsers() {
    return this.newChatUsers;
  }

  getChatUsersId() {
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

  getPrivates() {
    return this.privates;
  }
}