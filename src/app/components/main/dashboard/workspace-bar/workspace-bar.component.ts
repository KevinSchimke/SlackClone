import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: any[] = [];
  constructor(public dialog: MatDialog, public createChannelService: FirestoreService, private firestore: Firestore) {
    this.getChannels();
  }

  async getChannels() {
    // this.channels = await this.createChannelService.getCollection('channels');
    // console.log('Channels are ', this.channels);
    let coll = collection(this.firestore, 'channels');
    let collData$ = collectionData(coll, { idField: 'id' });
    collData$.subscribe((collItem) => {
      this.channels = collItem;
    });
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }
}
