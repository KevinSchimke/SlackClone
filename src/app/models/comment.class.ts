export class Comment {
  id: string;
  userId: string;
  userName: string;
  userSrc: string;
  creationDate: Date;
  message: string;
  img: string;
  reactions: [{ id: string, users: string[] }];

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.userId = obj ? obj.userId : '';
    this.userName = obj ? obj.userName : '';
    this.userSrc = obj ? obj.userSrc : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.img = obj ? obj.img : '';
    this.reactions = obj ? obj.reactions : [];
  }

  toJson() {
    return {
      userId: this.userId,
      userName: this.userName,
      userSrc: this.userSrc,
      creationDate: this.creationDate,
      message: this.message,
      img: this.img,
      reactions: JSON.stringify(this.reactions)
    };
  }

}
