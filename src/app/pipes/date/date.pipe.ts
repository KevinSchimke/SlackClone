import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: Timestamp | Date | string): string {
    if((typeof value !== 'string')){
      if (!(value instanceof Date)) value = value.toDate();
      if (value instanceof Date) value = value.toLocaleTimeString();
    }
    return value;
  }
}
