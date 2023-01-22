import { Component } from '@angular/core';
import { Auth, deleteUser, updateEmail, updatePassword, signOut, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {
  username = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  email = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  step = -1;
  hide = true;

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    public currentDataService: CurrentDataService,
    private authError: AuthErrorService,
    private pushupMessage: PushupMessageService,
    private router: Router,
    private dialogRef: MatDialogRef<EditsettingcardComponent>) { }

  setStep(index: number) {
    this.step = index;
  }

  updateUserData() {
    this.firestoreService.updateUser(this.currentDataService.getUser().toJson());
  }

  updateUserName() {
    if (this.username.valid) {
      let username = this.username.value.username;
      this.currentDataService.currentUser.name = username!;
      this.updateUserData();
    }
  }

  updateUserEmail() {
    if (this.email.valid) {
      let email = this.email.value.email!;
      updateEmail(this.auth.currentUser!, email)
        .then(() => {
          this.currentDataService.currentUser.mail = email!;
          this.updateUserData();
          sendEmailVerification(this.auth.currentUser!)
          this.pushupMessage.openPushupMessage('success', 'Please verify your new email')
          this.closeDialog();
          this.logout();
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  updateUserPassword() {
    if (this.password.valid) {
      let password = this.password.value.password!;
      updatePassword(this.auth.currentUser!, password)
        .then(() => {
          console.log('Update password successfully');
        }).catch((error) => {
          console.log(error);
        });
    }
  }

  deleteUser() {
    deleteUser(this.auth.currentUser!)
      .then(() => {
        console.log('save');
      }).catch((error) => {
        console.log(error);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.authError.getErrorMessage(formGroup, formControlName)
  }
}
