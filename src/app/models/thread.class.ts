export class Thread {
  src: string;
  name: string;
  timestamp: number;
  message: string;
  comments: object;

  constructor(obj?: any) {
    this.src = obj ? obj.src : '';
    this.name = obj ? obj.name : '';
    this.timestamp = obj ? obj.timestamp : '';
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : '';
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
