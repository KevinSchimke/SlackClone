import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from 'src/app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public uid: any;
  public currentUser = new User();

  constructor(private auth: Auth) { }

  set(obj: User) {
    this.currentUser.id = obj.id;
    this.currentUser.name = obj.name;
    this.currentUser.mail = obj.mail;
    this.currentUser.phone = obj.phone;
    this.currentUser.src = obj.src;
    this.currentUser.state = obj.state;
    this.currentUser.status = obj.status;
    this.currentUser.lastLogin = obj.lastLogin;
  }

  get() {
    return this.currentUser;
  }

  setUid() {
    this.uid = this.auth.currentUser?.uid;
  }

  getUid() {
    return this.uid;
  }
}