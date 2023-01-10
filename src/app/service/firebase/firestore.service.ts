import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';
import { Comment } from 'src/app/models/comment.class';
import { Thread } from 'src/app/models/thread.class';
import { User } from 'src/app/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  // 
  name = 'Angular';
  description = 'Toller Channel';
  locked = false;
  obj_arr: any[] = [];

  constructor(private firestore: Firestore) { }


  async createChannel() {
    let newChannel = new Channel();
    newChannel.name = 'Test';
    newChannel.description = 'Toller Channel';
    newChannel.creationDate = new Date();
    let coll = collection(this.firestore, 'channels');
    await setDoc(doc(coll), newChannel.toJson());
    console.log('created Channel');
  }

  async saveChannel() {
    // let coll = collection(this.firestore);
  }


  async saveThread() {
    let coll = collection(this.firestore, 'channels', 'Angular', 'ThreadCollection');
    await setDoc(doc(coll), { thread: 'laeuft' });
    console.log('created Channel');
  }

  async saveComment() {
    let coll = collection(this.firestore, 'channels', 'Angular', 'ThreadCollection', 'ThreadID', 'Thread-Comments');
    await setDoc(doc(coll), { comment: 'laeuft' });
    console.log('created comment');
  }

  async save(obj: Channel, collPath: string) {
    let coll = collection(this.firestore, collPath);
    await setDoc(doc(coll), obj.toJson());
    console.log('created Channel');
  }

  async getCollection(collPath: string) {
    // let arr: any[] = [];
    let coll = collection(this.firestore, collPath);
    let collData$ = collectionData(coll, { idField: 'id' });
    collData$.subscribe((collItem) => {
      this.obj_arr = collItem;
      console.log(this.obj_arr);
      // return obj_arr;
      // collItem.forEach(item => {
        // if (collPath === 'channels') {
        //   let obj = new Channel(item);
        //   console.log('Current obj.id is ', obj.id);
        //   console.log(obj_arr[0]);
        //   obj_arr.push(obj);
        // }
        // else {
        //   obj_arr.splice(obj_arr.indexOf(obj.id), 1)
        // }
      // });
    });
    return this.obj_arr;
  }
}
