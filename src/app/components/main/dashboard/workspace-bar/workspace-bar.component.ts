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

  currentUser?: User;
  username: string = 'valer';


  constructor(public dialog: MatDialog, public firestoreService: FirestoreService, private sort: SortService, private currentData: CurrentDataService) { }

   ngOnInit() {
    this.currentUser = this.currentData.getUser();
    this.collChannels$ = this.firestoreService.getCollection('channels');
    this.collChannels$.subscribe((channels: any[]) => this.channels = this.sort.sortByName(channels));
    console.log(this.currentUser.mail);
    console.log(this.currentUser.privates[0]);
    console.log(this.currentData.currentUser);
    console.log(this.currentData.currentUser['privates']);
    console.log(this.currentData.getUserPrivates);
    // currentUser.privates.forEach(element => {
    //   console.log(element);
    //   let private$ = this.firestoreService.getDocument(element, 'privates');
    //   private$.subscribe((message: any) =>{
    //     // this.privates.push(message);
    //     console.log(message);

    //   });
    // });
    // console.log(this.privates);

    // const q = this.firestoreService.getCurrentUserData('privates', 'users', this.username);
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   this.privates.push(doc.data());
    // console.log(doc.id, " => ", doc.data());
    // });
    // console.log(this.collPrivates$)
    // this.collPrivates$.subscribe((privates: any[]) =>  console.log(privates));
  }
  //this.privates = this.sort.sortByName(privates)

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
    });
  }

}