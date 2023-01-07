import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Channel } from 'src/app/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  // 
  name = 'Angular';
  description = 'Toller Channel';
  locked = false;

  constructor(private firestore: Firestore) { }


  async createChannel() {
    let newChannel = new Channel();
    newChannel.name = 'Angular';
    newChannel.description = 'Toller Channel';
    newChannel.creationDate = new Date();
    let coll = collection(this.firestore, 'channels');
    await setDoc(doc(coll, 'Angular'), newChannel.toJSON());
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
}
