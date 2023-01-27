export class Thread {
  id: string;
  userId: string;
  creationDate: Date;
  message: string;
  comments: number;
  lastComment: Date;
  img: string;
  reactions: [{ id: string, users: string[] }];
  users: string[];

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.userId = obj ? obj.userId : '';
    this.creationDate = obj ? obj.creationDate : new Date();
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : 0;
    this.lastComment = obj ? obj.lastComment : new Date();
    this.img = obj ? obj.img : '';
    this.reactions = obj ? obj.reactions : [];
    this.users = obj ? obj.users : [];
  }

  toJson() {
    return {
      userId: this.userId,
      creationDate: this.creationDate,
      message: this.message,
      comments: this.comments,
      lastComment: this.lastComment,
      img: this.img,
      reactions: JSON.stringify(this.reactions),
      users: JSON.stringify(this.users)
    };
  }
}
