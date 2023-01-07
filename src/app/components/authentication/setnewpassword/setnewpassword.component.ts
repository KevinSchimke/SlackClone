import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private auth: Auth, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.routeData = params;
    });
  }

  setNewPassword() {
    if (this.user.valid) {
      const password = this.user.value.password;
      confirmPasswordReset(this.auth, this.routeData['oobCode'], password!)
        .then(() => {
          console.log('running');
        }).catch((error) => {
          console.log(error);
        });
    }
  }

  getErrorMessage(formControl: string) {
    if (formControl == 'password') {
      if (this.user.get('password')?.hasError('required')) return 'You must enter a password';
      if (this.user.get('password')?.hasError('minlength')) return 'Your password is short';
    }
    return '';
  }
}
