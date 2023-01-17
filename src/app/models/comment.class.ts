export class Comment {

  userId: string;
  userName: string;
  userSrc: string;
  creationDate: Date;
  message: string;
  img: string;
  test = '';

  constructor(obj?: any) {
    this.userId = obj ? obj.userId : '';
    this.userName = obj ? obj.userName : '';
    this.userSrc = obj ? obj.userSrc : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.img = obj ? obj.img : '';
    //   Reactions (Emojis)
  }

  toJson() {
    return {
      userId: this.userId,
      userName: this.userName,
      userSrc: this.userSrc,
      creationDate: this.creationDate,
      message: this.message,
      img: this.img,
    };
  }

}
