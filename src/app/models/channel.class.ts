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
        this.id = obj.id ? obj.id: '';
        this.name = obj.name ? obj.name : '';
        this.users = obj.users ? obj.users : ['user0'];
        this.topic = obj.topic ? obj.topic : '';
        this.description = obj.description ? obj.description : '';
        this.creationDate = obj.creationDate ? obj.creationDate : new Date();
        this.creator = obj.creator ? obj.creator : '';
        this.locked = obj.locked ? obj.locked : false;
    }

    toJson() {
        return {
            name: this.name,
            users: this.users,
            topic: this.topic,
            description: this.description,
            creationDate: this.creationDate,
            creator: this.creator,
            locked: this.locked
        };
    }
}
