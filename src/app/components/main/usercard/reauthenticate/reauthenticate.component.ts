import { Component } from '@angular/core';
import { Auth, reauthenticateWithCredential, EmailAuthProvider, deleteUser, updateEmail, updatePassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent {
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

  constructor(private auth: Auth, private firestoreService: FirestoreService, private currentDataService: CurrentDataService, private authError: AuthErrorService) { }

  setStep(index: number) {
    this.step = index;
  }

  reauthenticate() {
    const credential = EmailAuthProvider.credential(this.auth.currentUser!.email!, '123456')
    console.log('credit', credential);

    reauthenticateWithCredential(this.auth.currentUser!, credential).then(() => {
      console.log('success', this.auth.currentUser);
    }).catch((error) => {
      console.log(error);
    });
  }

  updateUserName() {
    if (this.username.valid) {
      let username = this.username.value.username;
      this.currentDataService.currentUser.name = username!;
      this.firestoreService.updateUser(this.currentDataService.getUser().toJson());
      console.log('Current User Service -->getUser<--', this.currentDataService.getUser());
      console.log('Current User Service -->getThread<--', this.currentDataService.getThread());
    }
  }

  updateUserEmail() {
    if (this.email.valid) {
      let email = this.email.value.email!;
      updateEmail(this.auth.currentUser!, email)
        .then(() => {
          console.log('Update email successfully');
        }).catch((error) => {
          console.log(error);
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

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.authError.getErrorMessage(formGroup, formControlName)
  }
}



