import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public uid: any;

  constructor(private auth: Auth) { }

  setUid() {
    this.uid = this.auth.currentUser?.uid;
  }

  getUid() {
    return this.uid;
  }
}
