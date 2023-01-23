import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Pipe({
  name: 'imgSrc'
})
export class ImgSrcPipe implements PipeTransform {

  constructor(private currentData: CurrentDataService){}

  transform(userId: string): string {
    let j = this.currentData.users.findIndex((user: User) => (user.id === userId));
    return this.currentData.users[j].src;
  }

}
