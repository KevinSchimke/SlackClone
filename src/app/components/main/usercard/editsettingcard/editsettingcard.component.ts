import { Component } from '@angular/core';
import { Auth, deleteUser, updateEmail, updatePassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.class';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-editsettingcard',
  templateUrl: './editsettingcard.component.html',
  styleUrls: ['./editsettingcard.component.scss']
})
export class EditsettingcardComponent {
  username = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  email = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  password = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  panelOpenState = false;
  step = -1;

  hide = true;
  user$: any;
  user: User

  constructor(private auth: Auth, private firestoreService: FirestoreService, private userService: UserService) {
    this.user = new User();
    this.user$ = this.firestoreService.getUser();
    this.user$.subscribe((user: User) => {
      this.user.name = user.name;
      this.user.id = user.id;
      this.user.mail = user.mail;
      this.user.telephone = user.telephone;
      this.user.src = user.src;
      this.user.state = user.state;
      this.user.status = user.status;
      this.user.lastLogin = user.lastLogin;
      this.user.creationDate = user.creationDate;
    });
    console.log(this.user);
  }

  setStep(index: number) {
    this.step = index;
  }

  updateUserName() {
    console.log(this.user$, 'update');

    this.firestoreService.updateUser();
    console.log('success');
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
    deleteUser(this.auth.currentUser!)
      .then(() => {
        console.log('save');
      }).catch((error) => {
        console.log(error);
      });
  }
}
