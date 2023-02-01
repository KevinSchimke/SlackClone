import { Component } from '@angular/core';
import { Auth, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent {
  currentUser!: User;
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<ReauthenticateComponent>,
    private dialog: MatDialog,
    private auth: Auth,
    public userService: UserService,
    private authError: AuthErrorService,
    private pushupMessage: PushupMessageService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.get();
  }

  reauthenticate() {
    if (this.password.valid) {
      let password = this.password.value.password;
      const credential = EmailAuthProvider.credential(this.auth.currentUser!.email!, password!)
      reauthenticateWithCredential(this.auth.currentUser!, credential).then(() => {
        this.dialog.open(AccountSettingsComponent)
        this.dialogRef.close();
      }).catch((error) => {
        this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
      });
    }
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.authError.getErrorMessage(formGroup, formControlName)
  }
}



