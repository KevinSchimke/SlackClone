import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorService {

  constructor() { }

  getErrorMessage(user: FormGroup, formControl: string) {
    if (formControl == 'username') {
      if (user.get('username')?.hasError('minlength')) return 'Your username is short';
      if (user.get('username')?.hasError('required')) return 'You must enter a username';
    }
    if (formControl == 'email') {
      if (user.get('email')?.hasError('required')) return 'You must enter a value';
      if (user.get('email')?.hasError('valid')) return 'Not a valid email';
    }
    if (formControl == 'password') {
      if (user.get('password')?.hasError('required')) return 'You must enter a password';
      if (user.get('password')?.hasError('minlength')) return 'Your password is short';
    }
    return '';
  }
}
