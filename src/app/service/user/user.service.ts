import { Injectable } from '@angular/core';
import { Auth, UserCredential } from '@angular/fire/auth';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from '../firebase/firestore.service';

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

  userState(user: User) {
    let lastLogin = user.lastLogin.toDate().getTime();
    let currentTime = new Date().getTime();
    let userActive: boolean;

    if (currentTime - lastLogin < 300000) {
      userActive = true;
    } else {
      userActive = false;
    }
    return userActive
  }
}