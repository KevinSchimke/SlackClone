import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, docData, updateDoc, where, query, deleteDoc, increment } from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';
import { Comment } from 'src/app/models/comment.class';
import { Reaction } from 'src/app/models/reaction.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore, private userService: UserService) { }

  async save(obj: Channel | Thread | Comment | User | Reaction, collPath: string, id?: string) {
    console.log('path is ', obj, collPath);
    let coll = collection(this.firestore, collPath);
    id ? await setDoc(doc(coll, id), obj.toJson()) : await setDoc(doc(coll), obj.toJson());
    console.log('Saved document');
  }

  getCurrentUserData(collPath: string, specifier: string, target: string) {
    const collRef = collection(this.firestore, collPath);
    const q = query(collRef, where(specifier, "array-contains", target));
    return q;
  }

  getCollection(collPath: string) {
    let coll = collection(this.firestore, collPath);
    let collData$ = collectionData(coll, { idField: 'id' });
    return collData$;
  }

  getDocument(id: string, collPath: string) {
    let coll = collection(this.firestore, collPath);
    let docRef = doc(coll, id);
    let user$ = docData(docRef);
    return user$;
  }

  getUser() {
    let docRef = doc(collection(this.firestore, 'users'), this.userService.uid);
    let user = docData(docRef);
    return user;
  }

  updateUser(obj: any) {
    let docRef = doc(collection(this.firestore, 'users'),)
    updateDoc(docRef, obj);
  }

  async addCommentToThread(collPath: string) {
    let docRef = doc(this.firestore, collPath);
    await updateDoc(docRef, {
      comments: increment(1),
      lastComment: new Date()
    });

  }

  deleteUser() {
    deleteDoc(doc(this.firestore, 'users', this.userService.uid));
  }
}
