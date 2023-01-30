import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReauthenticateComponent } from '../../dialogs/reauthenticate/reauthenticate.component';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  currentUser = new User();

  constructor(public dialog: MatDialog, private auth: Auth, private router: Router, public userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.get();
    if (!this.currentUser.src) this.currentUser.src = "assets/img/user0.png";
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
