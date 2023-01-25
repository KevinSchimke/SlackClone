import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user/user.service';
import { ReauthenticateComponent } from '../reauthenticate/reauthenticate.component';

@Component({
  selector: 'app-infocard',
  templateUrl: './infocard.component.html',
  styleUrls: ['./infocard.component.scss']
})
export class InfocardComponent {

  constructor(public userService: UserService, private dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(ReauthenticateComponent);
  }
}
