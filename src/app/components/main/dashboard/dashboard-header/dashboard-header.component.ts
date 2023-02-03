import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReauthenticateComponent } from '../../dialogs/reauthenticate/reauthenticate.component';
import { User } from 'src/app/models/user.class';
import { UserService } from 'src/app/service/user/user.service';
import { ProfileSettingsComponent } from '../../dialogs/profile-settings/profile-settings.component';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent {
  currentUser = new User();

  constructor(public dialog: MatDialog, private auth: Auth, private router: Router, public userService: UserService, private currentDataService: CurrentDataService) { }

  ngOnInit() {
    this.currentUser = this.userService.get();
    if (!this.currentUser.src) this.currentUser.src = "assets/img/user0.png";
  }
  openAccountSettings(): void {
    this.dialog.open(ReauthenticateComponent);
  }

  openProfileSettings(): void {
    this.dialog.open(ProfileSettingsComponent);
  }

  logout() {
    this.currentDataService.snapshot_arr.forEach((unsub) => unsub());
    this.currentDataService.subscription_arr.forEach((sub) => sub.unsubscribe());
    for (let i = 1; i < 9999; i++) window.clearInterval(i);

    signOut(this.auth)
    // .then(() => {
    //   location.reload();
    //   this.router.navigate(['/login']);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }
}
