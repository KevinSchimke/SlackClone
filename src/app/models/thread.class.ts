import { Timestamp } from "@angular/fire/firestore";

export class Thread {
  src: string;
  name: string;
  timestamp: Timestamp;
  message: string;
  comments: object;

  constructor(obj?: any) {
    this.src = obj ? obj.src : '';
    this.name = obj ? obj.name : '';
    this.timestamp = obj ? obj.timestamp : '';
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : '';

    // let coll = collection(this.firestore, 'channels','Angular','Threads');
    // this.users$ = collectionData(coll,{idField:'id'});
    // this.users$.subscribe((user) => {
    //   this.users = user;
    //   console.log(this.users);
    // });
  }

  toJSON() {
    return {
      src: this.src,
      name: this.name,
      timestamp: this.timestamp,
      message: this.message,
      comments: this.comments,
    };
  }
}
