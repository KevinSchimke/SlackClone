import { Component, ElementRef, ViewChild } from '@angular/core';
import { Auth, deleteUser, updateEmail, updatePassword, signOut, sendEmailVerification } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { AuthService } from 'src/app/service/firebase/auth.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {

  @ViewChild('phone') phone?: ElementRef
  email = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  deletUsername: string = '';

  step = -1;
  hide = true;

  constructor(
    public auth: Auth,
    private firestoreService: FirestoreService,
    private authError: AuthErrorService,
    private pushupMessage: PushupMessageService,
    private dialogRef: MatDialogRef<AccountSettingsComponent>,
    public userService: UserService,
    private authService: AuthService,
    private formErrorService: FormErrorService) {
  }

  setStep(index: number) {
    if (this.step == index) {
      this.step = -1;
    } else {
      this.step = index;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async updateUserData() {
    await this.firestoreService.updateUser(this.userService.get().toJson());
  }

  async updateUserEmail() {
    if (this.email.valid) {
      let email = this.email.value.email!;
      updateEmail(this.auth.currentUser!, email)
        .then(() => {
          this.userService.currentUser.mail = email!;
          this.updateUserData();
        })
        .then(() => {
          sendEmailVerification(this.auth.currentUser!)
          this.pushupMessage.openPushupMessage('success', 'Please verify your new email')
        })
        .then(() => {
          this.closeDialog();
          this.authService.logout();
        })
        .catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  updateUserPassword() {
    if (this.password.valid) {
      let password = this.password.value.password!;
      updatePassword(this.auth.currentUser!, password)
        .then(() => {
          this.pushupMessage.openPushupMessage('success', 'Update password successfully')
          this.closeDialog();
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  async deleteCurrentUser() {
    try {
      await this.firestoreService.deleteUser();
      await deleteUser(this.auth.currentUser!);
      location.reload();
    } catch (error) {
      console.error();
    }
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.formErrorService.getMessage(formGroup, formControlName)
  }
}

