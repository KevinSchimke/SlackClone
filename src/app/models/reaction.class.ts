export class Reaction {
    users: any[];
  
    constructor(uids?: any[]) {
      this.users = uids ? uids : [];
    }
  
    toJson() {
      return {
        users: this.users
      };
    }
  }