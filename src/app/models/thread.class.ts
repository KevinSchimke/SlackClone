export class Thread {
  userId: string;
  userName: string;
  userSrc: string;
  creationDate: Date;
  message: string;
  comments: object;
  img: string;

  constructor(obj?: any) {
    this.userId = obj ? obj.userId : '';
    this.userName = obj ? obj.userName : '';
    this.userSrc = obj ? obj.userSrc : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : '';
    this.img = obj ? obj.img : '';
  }

  toJson() {
    return {
      userid: this.userId,
      userName: this.userName,
      userSrc: this.userSrc,
      creationDate: this.creationDate,
      message: this.message,
      comments: this.comments,
      img: this.img
    };
  }
}
