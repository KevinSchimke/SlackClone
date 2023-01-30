import { Pipe, PipeTransform, resolveForwardRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { UserService } from 'src/app/service/user/user.service';

@Pipe({
  name: 'messagePartner',
  pure: false,
})
export class MessagePartnerPipe implements PipeTransform {

  filteredUserIds: string[] = [];

  filteredUserNames: string[] = [];

  constructor(private user: UserService, private currentData: CurrentDataService) { }

  transform(users: string[], allUsers: any[]): string {
    this.filteredUserNames = [];
    this.filteredUserIds = this.getFuids(users);
    this.filteredUserIds.forEach((fuid) => this.findFilteredName(fuid, allUsers));
    // console.log('messagepartner pipe rödelt');
    return this.filteredUserNames.join(", ");
  }

  getFuids(users: string[]) {
    if (this.isChatWithMyself(users))
      return [this.user.getUid()];
    else
      return users.filter((user) => (user !== this.user.getUid()));
  }

  findFilteredName(fuid: string, allUsers: any[]) {
    let j = allUsers.findIndex((user: User) => (user.id === fuid));
    if (allUsers[j])
      this.filteredUserNames.push(allUsers[j].name);
  }

  isChatWithMyself(users: string[]) {
    return JSON.stringify(users) === JSON.stringify([this.user.getUid()]);
  }
}
