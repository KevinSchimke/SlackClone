import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: any[] = [];
  collData$: any;
  collData2$: any;
  user$: any;

  constructor(public dialog: MatDialog,
    public createChannelService: FirestoreService,
    private userService: UserService,
    private firestoreService: FirestoreService) {
    this.collData$ = this.createChannelService.getCollection('channels');
    // this.collData2$ = this.createChannelService.getCollection('users/' + '1oiPPQw7aPUmTKkZNk2QBRoZnRz2/' + 'channels');
    // this.collData2$.subscribe((data: any) => console.log(data));

    // this.user$ = this.firestoreService.getUser(this.userService.getUid());
    // this.user$.subscribe((data: any) => console.log(data));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }
}
