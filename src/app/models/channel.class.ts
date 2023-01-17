export class Channel {
    channelId: string;
    channelName: string;
    users: string[];
    topic: string;
    description: string;
    creationDate: Date;
    creator: string;
    locked: boolean | string;

    constructor(obj?: any) {
        this.channelId = obj ? obj.channelId : '';
        this.channelName = obj ? obj.channelName : '';
        this.users = obj ? obj.users : ['user0'];
        this.topic = obj ? obj.topic : '';
        this.description = obj ? obj.description : '';
        this.creationDate = obj ? obj.creationDate : new Date();
        this.creator = obj ? obj.creator : '';
        this.locked = obj ? obj.locked : false || '';
    }
    toJson() {
        return {
            channelName: this.channelName,
            users: this.users,
            topic: this.topic,
            description: this.description,
            creationDate: this.creationDate,
            creator: this.creator,
            locked: this.locked,
        };
    }
}