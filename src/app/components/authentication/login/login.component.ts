import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class LoginComponent {

  hide = true;
  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private auth: Auth) { }

  login() {
    if (this.user.valid) {
      const email = this.user.value.email;
      const password = this.user.value.password;
      signInWithEmailAndPassword(this.auth, email!, password!)
        .then((user: UserCredential) => {
          console.log(user);
        }).catch((error) => {
          console.log(error);
        });
    }
  }

  getErrorMessage(formControl: string) {
    if (formControl == 'email') {
      if (this.user.get('email')?.hasError('required')) return 'You must enter a value';
      if (this.user.get('email')?.hasError('valid')) return 'Not a valid email';
    }
    if (formControl == 'password') {
      if (this.user.get('password')?.hasError('required')) return 'You must enter a password';
      if (this.user.get('password')?.hasError('minlength')) return 'Your password is short';
    }
    return '';
  }
}