export class Thread {
  src: string;
  name: string;
  creationDate: Date;
  message: string;
  comments: object;

  constructor(obj?: any) {
    this.src = obj ? obj.src : '';
    this.name = obj ? obj.name : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.message = obj ? obj.message : '';
    this.comments = obj ? obj.comments : '';
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
