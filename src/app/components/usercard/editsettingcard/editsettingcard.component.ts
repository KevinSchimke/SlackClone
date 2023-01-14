import { Component } from '@angular/core';
import { Auth, updateEmail, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {
  panelOpenState = false;
  step = -1;

  hide = true;
  user$: any;


  constructor(private auth: Auth, private firestoreService: FirestoreService, private userService: UserService) {
    this.user$ = this.firestoreService.getUser(this.userService.getUid());
    this.user$.subscribe((data: User) => console.log(data));
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
