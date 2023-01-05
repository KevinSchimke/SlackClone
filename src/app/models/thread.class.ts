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
    this.comments = [new Comment,new Comment];
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
