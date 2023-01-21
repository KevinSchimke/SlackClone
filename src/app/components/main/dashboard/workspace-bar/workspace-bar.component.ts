import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SortService } from 'src/app/service/sort/sort.service';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
  panelOpenState = false;
  channels: any[] = [];
  collChannels$: any = EMPTY;

  privates: any[] = [];
  collPrivates$: any = EMPTY;

  currentUser: User = new User();
  username: string = 'valer';
  user$: any = EMPTY;


  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private sort: SortService, private currentData: CurrentDataService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }

}