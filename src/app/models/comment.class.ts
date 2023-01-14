export class Comment {

  userid: string;
  creationDate: Date;
  message: string;
  img: string;

  constructor(obj?: any) {
    this.userid = obj ? obj.userid : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.img = obj ? obj.img : '';
    //   Reactions (Emojis)
  }

  toJson() {
    return {
      userid: this.userid,
      creationDate: this.creationDate,
      message: this.message,
      img: this.img,
    };
  }

}
