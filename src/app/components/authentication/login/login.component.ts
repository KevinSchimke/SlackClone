import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';
import { UserService } from 'src/app/service/user/user.service';

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
  guest = {
    email: 'slack@kevin-schimke.de',
    password: '2Lbt^pHb^^>h+WeQeQXK'
  }

  constructor(private auth: Auth, private authError: AuthErrorService, private pushupMessage: PushupMessageService, private userService: UserService, private router: Router) { }

  loginAsGuest() {
    this.login(this.guest.email, this.guest.password);
  }

  loginAsUser() {
    if (this.user.valid) {
      const email = this.user.value.email!;
      const password = this.user.value.password!;
      this.login(email, password);
    }
  }

  async login(email: string, password: string) {
    // signInWithEmailAndPassword(this.auth, email!, password!)
    //   .then((user: UserCredential) => {
    //     if (user.user?.emailVerified) {
    //       this.router.navigate(['/main']);
    //       this.pushupMessage.openPushupMessage('success', 'Login Successfully')
    //     } else {
    //       this.router.navigate(['/verification']);
    //       this.pushupMessage.openPushupMessage('info', 'Please verify your E-Mail Address')
    //     }
    //   }).catch((error) => {
    //     this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
    //   });

    try {
      const resp = await signInWithEmailAndPassword(this.auth, email, password);
      if (resp.user?.emailVerified) {
        this.navigateToMain();
        this.pushupMessage.openPushupMessage('success', 'Login Successfully');
      } else {
        this.navigateToVerification();
        this.pushupMessage.openPushupMessage('info', 'Please verify your E-Mail Address');
      }
    } catch (error: any) {
      this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code));
    }
  }

  private navigateToMain() {
    this.router.navigate(['/main']);
  }

  private navigateToVerification() {
    this.router.navigate(['/verification']);
  }

  getErrorMessage(formControlName: string) {
    return this.authError.getErrorMessage(this.user, formControlName)
  }
}