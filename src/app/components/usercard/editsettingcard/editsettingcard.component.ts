import { Component } from '@angular/core';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {
  panelOpenState = false;
  step = -1;

  hide = true;

  setStep(index: number) {
    this.step = index;
  }

}
