export class Comment {
    userid: string;
    timestamp: Date;
    message: string;
  
    constructor(obj?: any) {
      this.userid = obj ? obj.userid : '';
      this.timestamp = obj ? obj.timestamp : 0;
      this.message = obj ? obj.message : '';
    //   Reactions (Emojis)
    }
  
    toJSON() {
      return {
        userid: this.userid,
        timestamp: this.timestamp,
        message: this.message,
      };
    }
  }
  