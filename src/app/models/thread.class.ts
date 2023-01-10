import { Timestamp } from "@angular/fire/firestore";

export class Thread {
  src: string;
  name: string;
  creationDate: Timestamp;
  message: string;
  comments: object;

  constructor(obj?: any) {
    this.src = obj ? obj.src : '';
    this.name = obj ? obj.name : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : '';

    // let coll = collection(this.firestore, 'channels','Angular','Threads');
    // this.users$ = collectionData(coll,{idField:'id'});
    // this.users$.subscribe((user) => {
    //   this.users = user;
    //   console.log(this.users);
    // });
  }

  toJson() {
    return {
      src: this.src,
      name: this.name,
      creationDate: this.creationDate,
      message: this.message,
      comments: this.comments,
    };
  }
}
