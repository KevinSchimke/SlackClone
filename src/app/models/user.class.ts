export class User {
    id: string;
    name: string;
    mail: string;
    phone: number | string;
    src: string;
    state: boolean; //active or inactive
    status: string; //e.g. "In Holidays"
    lastLogin: Date;
    pathDefaultImg: string = 'https://firebasestorage.googleapis.com/v0/b/slackclone-6519b.appspot.com/o/images%2F2vaxlp928h2?alt=media&token=77a22de9-f29e-45eb-91cd-e61def848038'

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.mail = obj ? obj.mail : '';
        this.phone = obj ? obj.phone : '';
        this.src = obj ? obj.src : this.pathDefaultImg;
        this.state = obj ? obj.state : false;
        this.status = obj ? obj.status : '';
        this.lastLogin = obj ? obj.lastLogin : new Date();
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            mail: this.mail,
            phone: this.phone,
            src: this.src,
            state: this.state,
            status: this.status,
            lastLogin: this.lastLogin,
        };
    }
}