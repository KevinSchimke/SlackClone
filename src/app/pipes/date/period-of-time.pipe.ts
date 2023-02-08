import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'periodOfTime'
})
export class PeriodOfTimePipe implements PipeTransform {

  newValue = '';
  ONE_MINUTE = 60;
  ONE_HOUR = 60 * this.ONE_MINUTE;
  ONE_DAY = 24 * this.ONE_HOUR;

  transform(creationTime: Timestamp | Date | string): any {
    if ((typeof creationTime !== 'string')) {
      if (!(creationTime instanceof Date)) creationTime = creationTime.toDate();
      if (creationTime instanceof Date) {
        this.newValue = this.evaluatePeriod(creationTime.getTime());
      }
      return this.newValue;
    }
  }

  evaluatePeriod(postCreationTime: any) {
    let currentTime = new Date().getTime();
    let timeDifference = (currentTime - postCreationTime) / 1000;
    if (timeDifference < this.ONE_MINUTE)
      return Math.round(timeDifference) + " seconds";
    else if (timeDifference < this.ONE_HOUR)
      return Math.round(timeDifference / this.ONE_MINUTE) + " minutes";
    else if (timeDifference < this.ONE_DAY)
      return Math.round(timeDifference / this.ONE_HOUR) + " hours";
    else
      return Math.round(timeDifference / this.ONE_DAY) + " days";
  }
}
