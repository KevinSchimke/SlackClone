import { Component } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
  collData$: any;

  constructor(public dialog: MatDialog, public createChannelService: FirestoreService, private firestore: Firestore) {
    this.collData$ = this.createChannelService.getCollection('channels');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }
}
