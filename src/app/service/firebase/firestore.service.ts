import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, docData } from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';
import { Comment } from 'src/app/models/comment.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  // 
  name = 'Angular';
  description = 'Toller Channel';
  locked = false;
  obj_arr: any[] = [];

  constructor(private firestore: Firestore, private userService: UserService) { }

  async saveThread() {
    let coll = collection(this.firestore, 'channels', 'Angular', 'ThreadCollection');
    await setDoc(doc(coll), { thread: 'laeuft' });
    console.log('created thread');
  }

  async saveComment() {
    let coll = collection(this.firestore, 'channels', 'Angular', 'ThreadCollection', 'ThreadID', 'Thread-Comments');
    await setDoc(doc(coll), { comment: 'laeuft' });
    console.log('created comment');
  }

  async save(obj: Channel | Thread | Comment | User, collPath: string) {
    let coll = collection(this.firestore, collPath);
    await setDoc(doc(coll), obj.toJson());
    console.log('Saved document');
  }

  getCollection(collPath: string) {
    let coll = collection(this.firestore, collPath);
    let collData$ = collectionData(coll, { idField: 'id' });
    return collData$;
  }

  getUser() {
    let docRef = doc(collection(this.firestore, 'users'), this.userService.getUid());
    let user = docData(docRef);
    return user;
  }
}
