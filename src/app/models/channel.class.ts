export class Channel {
    id: string;
    name: string;
    users: string[];
    topic: string;
    description: string;
    creationDate: Date;
    creator: string;
    locked: boolean;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.users = obj ? obj.users : ['user0'];
        this.topic = obj ? obj.topic : '';
        this.description = obj ? obj.description : '';
        this.creationDate = obj ? obj.creationDate : new Date();
        this.creator = obj ? obj.creator : '';
        this.locked = obj ? obj.locked : false;
    }
    toJson() {
        return {
            name: this.name,
            users: this.users,
            topic: this.topic,
            description: this.description,
            creationDate: this.creationDate,
            creator: this.creator,
            locked: this.locked,
        };
    }
}
