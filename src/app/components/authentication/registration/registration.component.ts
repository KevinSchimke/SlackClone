import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/firebase/auth.service';
import { FormErrorService } from 'src/app/service/form-error/form-error.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class RegistrationComponent {
  user = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  });
  hide = true;

  constructor(private authService: AuthService, private formErrorService: FormErrorService) { }

  register() {
    if (this.user.valid) {
      const email = this.user.value.email!;
      const password = this.user.value.password!;
      this.authService.usernameNewUser = this.user.value.username!;
      this.authService.createUserWithEmailAndPassword(email, password)
    }
  }

  getErrorMessage(formControlName: string) {
    return this.formErrorService.getMessage(this.user, formControlName)
  }
}