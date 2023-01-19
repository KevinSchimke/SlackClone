export class Private {
  privateId: string;
  channelName: string;
  users: string[];
  topic: string;
  description: string;
  creationDate: Date;
  creator: string;

  constructor(obj?: any) {
    this.privateId = obj ? obj.privateId : '';
    this.users = obj ? obj.users : [''];
    this.channelName = obj ? obj.channelName : '';
    this.topic = obj ? obj.topic : '';
    this.description = obj ? obj.description : '';
    this.creationDate = obj ? obj.creationDate : new Date();
    this.creator = obj ? obj.creator : '';
  }

  toJson() {
    return {
      users: this.users,
      channelName: this.channelName,
      topic: this.topic,
      description: this.description,
      creationDate: this.creationDate,
      creator: this.creator,
    };
  }
}
