import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorService {

  constructor() { }

  getErrorMessage(user: FormGroup, formControl: string) {
    if (formControl == 'username') {
      if (user.get('username')?.hasError('minlength')) return 'Your username is too short';
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

  errorCode(code: string) {
    if (code == 'auth/email-already-in-use') return 'E-Mail address already exists';
    if (code == 'auth/weak-password') return 'Short Password length';
    if (code == 'auth/invalid-email') return 'E-Mail address isn\'t valid';
    if (code == 'auth/user-not-found') return 'User not found';
    if (code == 'auth/wrong-password') return 'Password incorrect';
    return 'Error unknow';
  }
}
