import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc, docData, updateDoc, where, query, deleteDoc, increment, addDoc } from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';
import { Comment } from 'src/app/models/comment.class';
import { Reaction } from 'src/app/models/reaction.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore, private userService: UserService) { }

  async save(obj: Channel | Thread | Comment | User | Reaction, collPath: string, id?: string) {
    let coll = collection(this.firestore, collPath);
    id ? await setDoc(doc(coll, id), obj.toJson()) : await setDoc(doc(coll), obj.toJson());
  }

  async add(obj: Channel) {
    const docRef = await addDoc(collection(this.firestore, "channels"), obj.toJson());
    return docRef.id;
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
    let user$ = docData(docRef, { idField: 'id' });
    return user$;
  }

  async updateThread(users: string[], collPath: string) {
    let docRef = doc(this.firestore, collPath);
    await updateDoc(docRef, {
      comments: increment(1),
      lastComment: new Date(),
      users: users
    });
  }

  updateObj(obj: Thread | Channel, collPath: string) {
    let docRef = doc(this.firestore, collPath);
    updateDoc(docRef, obj.toJson());
  }

  getUser(uid: any) {
    let docRef = doc(collection(this.firestore, 'users'), uid);
    let user = docData(docRef);
    return user;
  }

  async updateLastLogin(date: Date) {
    let docRef = doc(collection(this.firestore, 'users'), this.userService.uid)
    await updateDoc(docRef, { lastLogin: date });
  }

  async updateUser(obj: any) {
    let docRef = doc(collection(this.firestore, 'users'), this.userService.uid)
    await updateDoc(docRef, obj);
  }

  async deleteUser() {
    await deleteDoc(doc(this.firestore, 'users', this.userService.uid));
  }
}
