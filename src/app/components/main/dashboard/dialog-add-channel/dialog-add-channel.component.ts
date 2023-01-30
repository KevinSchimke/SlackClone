import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

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

  constructor(public dialogRef: MatDialogRef<DialogAddChannelComponent>, private setFirestore: FirestoreService, private user: UserService) { }

  onSubmit() {
    if (this.channelForm.valid) {
      this.createNewChannel();
    }
  }

  async createNewChannel() {
    let channel: Channel = new Channel();
    channel.channelName = this.channelForm.controls.name.value || '';
    channel.description = this.channelForm.controls.description.value || '';
    if(this.channelForm.controls.locked.value === '' || this.channelForm.controls.locked.value === null)
      channel.locked = false;
    else
      channel.locked = this.channelForm.controls.locked.value;
    channel.creator = this.user.getUid();
    channel.users.push(channel.creator);
    await this.setFirestore.save(channel, 'channels');
    this.dialogRef.close();
  }
}
