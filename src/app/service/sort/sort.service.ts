import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }


  sortByDate(array: any[]) {
    let self = this;
    array.sort(function (a: { creationDate: Timestamp }, b: { creationDate: Timestamp }) {
      return self.compareDate(a.creationDate.seconds, b.creationDate.seconds);
    });
    return array;
  }

  compareDate(a: number, b: number) {
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }
}
