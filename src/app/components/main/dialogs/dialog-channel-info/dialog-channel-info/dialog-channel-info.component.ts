import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';

export interface DialogData {
  channel: any
}

@Component({
  selector: 'app-dialog-channel-info',
  templateUrl: './dialog-channel-info.component.html',
  styleUrls: ['./dialog-channel-info.component.scss']
})


export class DialogChannelInfoComponent {

  injected: any = {}
  channel: Channel = new Channel();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(){
    this.injected = this.data;
    this.channel = new Channel(this.injected);
    console.log(this.channel);
  }
}
