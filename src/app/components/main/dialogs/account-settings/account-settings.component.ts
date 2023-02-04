import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/firebase/auth.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';
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

  async updateUserEmail() {
    if (this.email.valid) {
      let email = this.email.value.email!;
      await this.authService.updateEmail(email)
        .then(() => {
          this.closeDialog();
        })
    }
  }

  async updateUserPassword() {
    if (this.password.valid) {
      let password = this.password.value.password!;
      await this.authService.updatePassword(password)
        .then(() => {
          this.closeDialog();
        })
    }
  }

  deleteCurrentUser() {
    this.authService.deleteUser();
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.formErrorService.getMessage(formGroup, formControlName)
  }
}