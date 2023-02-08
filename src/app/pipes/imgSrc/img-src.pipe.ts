import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { UserService } from 'src/app/service/user/user.service';

@Pipe({
  name: 'imgSrc'
})

/** This pipe is to get the user image source-file by user-id. */
export class ImgSrcPipe implements PipeTransform {

  allUsers: User[] = [];
  currentUserId: string = '';

  constructor(private currentData: CurrentDataService, private user: UserService) { }

  transform(userId: string | string[], users: User[]): string {
    this.allUsers = users;
    this.currentUserId = this.user.getUid();
    if (this.currentData.usersAreLoaded)
      return this.findImgSrc(userId);
    else
      return 'assets/img/user0.png';
  }

  findImgSrc(userId: string | string[]) {
    if (typeof userId == 'string')
      return this.convertUidString(userId);
    else
      return this.convertUidArray(userId);
  }

  convertUidString(userId: string) {
    let i = this.allUsers.findIndex((user: User) => (user.id === userId));
    if (i == -1)
      return 'assets/img/user0.png';
    else
      return this.allUsers[i].src;
  }


  convertUidArray(userIds: string[]) {
    let srcs: string[] = [];
    userIds.forEach(uid => this.pushSrc(uid, srcs));
    if (srcs.length > 0)
      return srcs[0];
    else
      return this.currentData.users.find((user: User) => (user.id === this.currentUserId))!.src;
  }

  pushSrc(uid: string, srcs: string[]) {
    let i = this.currentData.users.findIndex((user: User) => (user.id === uid && uid !== this.currentUserId));
    if (i !== -1)
      srcs.push(this.currentData.users[i].src);
  }

  
}
