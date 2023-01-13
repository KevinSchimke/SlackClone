import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uid?: string;

  setUid(uid: string) {
    this.uid = uid;
  }

  getUid() {
    return this.uid;
  }
}
