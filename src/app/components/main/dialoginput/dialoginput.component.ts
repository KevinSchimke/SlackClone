import { Component } from '@angular/core';

@Component({
  selector: 'app-dialoginput',
  templateUrl: './dialoginput.component.html',
  styleUrls: ['./dialoginput.component.scss']
})
export class DialoginputComponent {

  message: string = '';
  chat: string[] = [];

  getMessage() {
    this.chat.push(this.message);
    this.message = '';
  }

}
