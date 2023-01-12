import { Component } from '@angular/core';
import { Auth, updateEmail, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'src/app/models/user.class';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {
  panelOpenState = false;
  step = -1;

  hide = true;

  constructor(private auth: Auth) {

  }

  ngOnInit(): void {
    this.load();
  }

  setStep(index: number) {
    this.step = index;
  }

  // updateUserEmail() {
  //   updateEmail(this.auth
  //     , "user@example.com")
  //     .then(() => {
  //       console.log('save');
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  // }

  load() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);

        // ...
      } else {
        // console.log(uid);
        // User is signed out
        // ...
      }
    });
  }
}
