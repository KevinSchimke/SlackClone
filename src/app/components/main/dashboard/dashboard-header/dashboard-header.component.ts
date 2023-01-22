import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditsettingcardComponent } from 'src/app/components/main/usercard/editsettingcard/editsettingcard.component';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReauthenticateComponent } from '../../usercard/reauthenticate/reauthenticate.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  currentUser = new User;

  constructor(public dialog: MatDialog, private auth: Auth, private router: Router, private currentData: CurrentDataService) { }

  ngOnInit() {
    this.currentUser = this.currentData.getUser();
    if(!this.currentUser.src) this.currentUser.src = "assets/img/user0.png";
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ReauthenticateComponent);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.log(error);
    });
  }
}
