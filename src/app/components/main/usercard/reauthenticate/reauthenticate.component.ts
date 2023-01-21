import { Component } from '@angular/core';
import { Auth, reauthenticateWithCredential, EmailAuthProvider } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { AuthErrorService } from 'src/app/service/firebase/auth-error.service';
import { EditsettingcardComponent } from '../editsettingcard/editsettingcard.component';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent {
  currentUser!: User;
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  hide = true;

  constructor(private dialog: MatDialog, private auth: Auth, private currentDataService: CurrentDataService, private authError: AuthErrorService) { }

  ngOnInit(): void {
    this.currentUser = this.currentDataService.getUser();
  }

  reauthenticate() {
    if (this.password.valid) {
      let password = this.password.value.password;
      const credential = EmailAuthProvider.credential(this.auth.currentUser!.email!, password!)
      reauthenticateWithCredential(this.auth.currentUser!, credential).then(() => {
        this.dialog.open(EditsettingcardComponent)
        // this.dialog.close(ReauthenticateComponent)
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  getErrorMessage(formGroup: FormGroup, formControlName: string) {
    return this.authError.getErrorMessage(formGroup, formControlName)
  }
}



