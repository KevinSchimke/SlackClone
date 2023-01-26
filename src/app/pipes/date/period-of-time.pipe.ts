import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'periodOfTime'
})
export class PeriodOfTimePipe implements PipeTransform {

  newValue = '';

  transform(value: Timestamp | Date | string): any {
    if ((typeof value !== 'string')) {
      if (!(value instanceof Date)) value = value.toDate();
      if (value instanceof Date) {
        this.newValue = this.evaluatePeriod(value.getTime());
      }
      return this.newValue;
    }

  }

  evaluatePeriod(postTime: any){
    let currentTime = new Date().getTime();
    let timeDifference = (currentTime - postTime)/1000;
    console.log(timeDifference);
    if (timeDifference < 60)
      return Math.round(timeDifference) + " seconds";
    else if (timeDifference < 3600)
      return Math.round(timeDifference/60) + " minutes";
    else if (timeDifference < 86400)
      return Math.round(timeDifference/(60*60)) + " hours";
    else
      return Math.round(timeDifference/(60*60*24)) + " days";
  }
}
