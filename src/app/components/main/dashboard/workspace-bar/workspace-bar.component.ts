import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { EMPTY } from 'rxjs';

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

  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private userService: UserService) { }

  ngOnInit(): void {
    this.collData$ = this.firestoreService.getCollection('channels');
    this.collData$.subscribe((channels: any[]) => this.sortChannels(channels));
    // this.collData2$ = this.createChannelService.getCollection('users/' + '1oiPPQw7aPUmTKkZNk2QBRoZnRz2/' + 'channels');
    // this.collData2$.subscribe((data: any) => console.log(data));

    this.user$ = this.firestoreService.getUser();
    this.user$.subscribe((data: User) => console.log(data));
  }

  sortChannels(channels: any[]) {
    let self = this;
    this.channels = channels.sort(function (a: { name: string }, b: { name: string }) {
      return self.compareStrings(a.name, b.name);
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