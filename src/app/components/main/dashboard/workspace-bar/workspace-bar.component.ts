import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: any[] = [];
  collData$: any = EMPTY;
  collData2$: any = EMPTY;;
  user$: any = EMPTY;
  userId: string = '';
  lastChildUrl = '';

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.collData$ = this.firestoreService.getCollection('channels');
    this.collData$.subscribe((channels: any[]) => this.sortChannels(channels));
  }

  sortChannels(channels: any[]) {
    let self = this;
    this.channels = channels.sort(function (a: { channelName: string }, b: { channelName: string }) {
      return self.compareStrings(a.channelName, b.channelName);
    });
  }

  compareStrings(a: string, b: string) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }

}