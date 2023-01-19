export class User {
    id: string;
    name: string;
    mail: string;
    telephone: number | string;
    src: string;
    state: boolean; //active or inactive
    status: string; //e.g. "In Holidays"
    lastLogin: Date;
    creationDate: Date;
    channels: string[];
    privates: any;


    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.mail = obj ? obj.mail : '';
        this.telephone = obj ? obj.telephone : '';
        this.src = obj ? obj.src : '';
        this.state = obj ? obj.state : false;
        this.status = obj ? obj.status : '';
        this.lastLogin = obj ? obj.lastLogin : null;
        this.creationDate = obj ? obj.creationDate : '';
        this.channels = obj ? obj.channels : [];
        this.privates = obj ? obj.privates : [];
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            mail: this.mail,
            telephone: this.telephone,
            src: this.src,
            state: this.state,
            status: this.status,
            lastLogin: this.lastLogin,
            creationDate: this.creationDate,
            channels: this.channels,
            privates: this.privates
        };
    }
}