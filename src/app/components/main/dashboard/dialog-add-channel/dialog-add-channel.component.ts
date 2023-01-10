import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent {
  channelForm = new FormGroup({
       name: new FormControl('', Validators.required),
       description: new FormControl(''),
       locked: new FormControl('')
     });

     constructor(public dialogRef: MatDialogRef<DialogAddChannelComponent>){
      console.log(this.channelForm);
     }
}
