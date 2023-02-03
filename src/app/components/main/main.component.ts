import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  users$: Observable<any> = EMPTY;
  updateLastLoginTime: number = 300000; //300000 = 5 min

  constructor(private firestoreService: FirestoreService, private currentDataService: CurrentDataService, private userService: UserService, private auth: Auth) { }

  ngOnInit(): void {
    this.users$ = this.firestoreService.getCollection('users');
    this.users$.subscribe((users) => this.currentDataService.setUsers(users));

    this.updateLastLogin();

    setInterval(() => this.updateLastLogin(), this.updateLastLoginTime);
  }

  updateLastLogin() {
    this.firestoreService.updateLastLogin(new Date())
  }
}