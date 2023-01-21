import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditsettingcardComponent } from 'src/app/components/main/usercard/editsettingcard/editsettingcard.component';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReauthenticateComponent } from '../../usercard/reauthenticate/reauthenticate.component';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {

  constructor(public dialog: MatDialog, private auth: Auth, private router: Router) { }

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
