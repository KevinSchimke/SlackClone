import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {

  constructor(private currentData: CurrentDataService){}


  transform(userId: string): string {
    let j = this.currentData.users.findIndex((user: User) => (user.id === userId));
    if (j == -1) {
      return 'Deleted User';
    }
    return this.currentData.users[j].name;
  }

}
