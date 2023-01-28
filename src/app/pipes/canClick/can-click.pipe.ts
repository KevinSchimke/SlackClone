import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Pipe({
  name: 'canClick'
})
export class CanClickPipe implements PipeTransform {

  constructor(private currentData: CurrentDataService) { }

  transform(userId: string): boolean {
    let j = this.currentData.users.findIndex((user: User) => (user.id === userId));
    if (j == -1) {
      return true;
    }
    return false;
  }

}
