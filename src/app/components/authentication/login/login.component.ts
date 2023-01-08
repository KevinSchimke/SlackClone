import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { AuthService } from 'src/app/service/firebase/auth.service';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';

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

  constructor(private auth: Auth, private authError: AuthErrorService, private pushupMessage: PushupMessageService, private router: Router) { }

  login() {
    if (this.user.valid) {
      const email = this.user.value.email;
      const password = this.user.value.password;
      signInWithEmailAndPassword(this.auth, email!, password!)
        .then((user: UserCredential) => {
          console.log(user);

          if (user.user?.emailVerified) {
            this.router.navigate(['/main']);
            this.pushupMessage.openPushupMessage('success', 'Login Successfully')
          } else {
            this.router.navigate(['/verification']);
            this.pushupMessage.openPushupMessage('info', 'Please verify your E-Mail Adress')
          }
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  getErrorMessage(formControlName: string) {
    return this.authError.getErrorMessage(this.user, formControlName)
  }
}