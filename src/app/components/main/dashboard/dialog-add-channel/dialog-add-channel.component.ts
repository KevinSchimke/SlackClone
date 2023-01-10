import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

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

  constructor(public dialogRef: MatDialogRef<DialogAddChannelComponent>, private setFirestore: FirestoreService) {
    console.log(this.channelForm);
  }



  test() {
    console.log(this.channelForm.controls.locked);
  }

  onSubmit() {
    if (this.channelForm.valid) {
      this.createNewChannel();
    }
  }

  async createNewChannel() {
    let newChannelJSON = {
      name: this.channelForm.controls.name.value,
      description: this.channelForm.controls.description.value,
      locked:this.channelForm.controls.locked.value
    }
    console.log(newChannelJSON);
    let channel = new Channel(newChannelJSON);
    console.log(channel);
    await this.setFirestore.save(channel, 'channels');
    this.dialogRef.close();
  }
}
