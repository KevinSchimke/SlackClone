import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class RegistrationComponent {
  username = new FormControl('', [Validators.required, Validators.minLength(6)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rePassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
  hide = true;
  hide2 = true;

  getErrorMessage(formControl: string) {
    if (formControl == 'username') {
      if (this.username.hasError('required')) return 'You must enter a username';
      if (!this.username.valid) return 'Your username is short';
    }
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
