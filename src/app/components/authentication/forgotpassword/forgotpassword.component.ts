import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class ForgotpasswordComponent {
  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private auth: Auth, private router: Router) { }

  reset() {
    if (this.user.valid) {
      const email = this.user.value.email;
      sendPasswordResetEmail(this.auth, email!)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  getErrorMessage(formControl: string) {
    if (formControl == 'email') {
      if (this.user.get('email')?.hasError('required')) return 'You must enter a value';
      if (this.user.get('email')?.hasError('email')) return 'Not a valid email';
    }
    return '';
  }
}