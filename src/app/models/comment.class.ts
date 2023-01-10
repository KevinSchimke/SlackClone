export class Comment {

  userid: string;
  creationDate: Date;
  message: string;

  constructor(obj?: any) {
    this.userid = obj ? obj.userid : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    //   Reactions (Emojis)
  }

  toJson() {
    return {
      userid: this.userid,
      creationDate: this.creationDate,
      message: this.message,
    };
  }

}
