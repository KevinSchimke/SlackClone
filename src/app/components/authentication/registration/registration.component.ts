import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { User } from 'src/app/models/user.class';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class RegistrationComponent {
  user = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;
  userData = new User();

  constructor(private auth: Auth, private authError: AuthErrorService, private router: Router, private firestore: Firestore) { }

  register() {
    if (this.user.valid) {
      const username = this.user.value.username;
      const email = this.user.value.email;
      const password = this.user.value.password;
      createUserWithEmailAndPassword(this.auth, email!, password!)
        .then((user: UserCredential) => {
          this.saveNewUser(user);
          this.verify(user);
        })
        .catch((error) => {
          console.log(this.authError.errorCode(error.code));
        });
    }
  }

  saveNewUser(user: UserCredential) {
    this.userData.id = user.user.uid;
    this.userData.mail = user.user.email!;
    this.userData.name = this.user.value.username!;
    this.userData.lastLogin = new Date();
    let coll = collection(this.firestore, 'users');
    setDoc(doc(coll, user.user.uid), this.userData.toJSON());
  }

  verify(user: UserCredential) {
    sendEmailVerification(user.user)
      .then(() => {
        this.router.navigate(['/verification']);
      });
  }

  getErrorMessage(formControlName: string) {
    return this.authError.getErrorMessage(this.user, formControlName)
  }
}