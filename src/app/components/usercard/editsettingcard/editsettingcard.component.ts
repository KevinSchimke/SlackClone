import { Component } from '@angular/core';
import { Auth, deleteUser, updateEmail, updatePassword } from '@angular/fire/auth';
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
    this.user$ = this.firestoreService.getUser();
    this.user$.subscribe((data: User) => console.log(data));
  }

  setStep(index: number) {
    this.step = index;
  }

  updateUserEmail() {
    updateEmail(this.auth.currentUser!, "kevin@kevin-schimke.de")
      .then(() => {
        console.log('save');
      }).catch((error) => {
        console.log(error);
      });
  }

  updateUserPassword() {
    updatePassword(this.auth.currentUser!, "111111")
      .then(() => {
        console.log('save');
      }).catch((error) => {
        console.log(error);
      });
  }

  deleteUser() {
    deleteUser(this.auth.currentUser!).then(() => {
      console.log('save');
    }).catch((error) => {
      console.log(error);
    });
  }

}
