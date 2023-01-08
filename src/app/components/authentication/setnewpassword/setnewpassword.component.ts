import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, confirmPasswordReset, applyActionCode } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { PushupMessageService } from 'src/app/service/pushup-message/pushup-message.service';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.component.html',
  styleUrls: ['./../authentication.component.scss']
})
export class SetnewpasswordComponent {
  user = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;
  routeData: any;

  constructor(private auth: Auth, private authError: AuthErrorService, private pushupMessage: PushupMessageService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'resetPassword') {
        this.routeData = params;
      }
      if (params['mode'] === 'verifyEmail') {
        applyActionCode(this.auth, params['oobCode'])
        this.router.navigate(['/login']);
      }
    });
  }

  setNewPassword() {
    if (this.user.valid) {
      const password = this.user.value.password;
      confirmPasswordReset(this.auth, this.routeData['oobCode'], password!)
        .then(() => {
          this.router.navigate(['/login']);
        }).catch((error) => {
          this.pushupMessage.openPushupMessage('error', this.authError.errorCode(error.code))
        });
    }
  }

  getErrorMessage(formControlName: string) {
    return this.authError.getErrorMessage(this.user, formControlName)
  }
}
