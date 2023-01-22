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
        this.src = obj ? obj.src : 'https://firebasestorage.googleapis.com/v0/b/slackclone-6519b.appspot.com/o/images%2F2vaxlp928h2?alt=media&token=77a22de9-f29e-45eb-91cd-e61def848038';
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