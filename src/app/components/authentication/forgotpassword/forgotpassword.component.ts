import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class ForgotpasswordComponent {
  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private auth: Auth, private authError: AuthErrorService, private pushupMessage: PushupMessageService, private router: Router) { }

  reset() {
    if (this.user.valid) {
      const email = this.user.value.email;
      sendPasswordResetEmail(this.auth, email!)
        .then(() => {
          this.router.navigate(['/login']);
          this.pushupMessage.openPushupMessage('success', 'Check your E-Mail Account');
        })
        .catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  getErrorMessage(formControlName: string) {
    return this.authError.getErrorMessage(this.user, formControlName)
  }
}