import { Timestamp } from "@angular/fire/firestore";

export class Channel {
    name: string;
    users: string[];
    topic: string;
    description: string;
    creationDate: Timestamp;
    creator: string;

    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.users = obj ? obj.users : [];
        this.topic = obj ? obj.topic : '';
        this.description = obj ? obj.description : '';
        this.creationDate = obj ? obj.creationDate : null;
        this.creator = obj ? obj.creator : '';
    }
}
