import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class ForgotpasswordComponent {
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage(formControl: string) {
    if (formControl == 'email') {
      if (this.email.hasError('required')) return 'You must enter a value';
      if (this.email.hasError('email')) return 'Not a valid email';
    }
    return '';
  }
}