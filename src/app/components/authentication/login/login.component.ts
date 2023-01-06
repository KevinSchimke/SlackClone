import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  hide = true;

  getErrorMessage(formControl: string) {
    if (formControl == 'email') {
      if (this.email.hasError('required')) return 'You must enter a value';
      if (this.email.hasError('email')) return 'Not a valid email';
    }
    if (formControl == 'password') {
      if (this.password.hasError('required')) return 'You must enter a password';
      if (!this.password.valid) return 'Your password is short';
    }
    return '';
  }
}