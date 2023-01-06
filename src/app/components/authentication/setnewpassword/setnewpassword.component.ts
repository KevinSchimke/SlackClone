import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class SetnewpasswordComponent {
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  hide = true;

  getErrorMessage(formControl: string) {
    if (formControl == 'password') {
      if (this.password.hasError('required')) return 'You must enter a password';
      if (!this.password.valid) return 'Your password is short';
    }
    return '';
  }
}
