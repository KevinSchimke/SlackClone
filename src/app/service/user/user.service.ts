import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public uid: any;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, ((user: any) => {
      this.setUid(user.uid);
    }))
  }

  setUid(uid: string) {
    this.uid = uid;
  }

  getUid() {
    return this.uid;
  }
}
