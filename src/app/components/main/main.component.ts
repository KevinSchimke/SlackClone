import { Component } from '@angular/core';
import { EMPTY, Observable, take } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  user$: Observable<any> = EMPTY;
  users$: Observable<any> = EMPTY;
  updateLastLoginTime: number = 300000; //300000 = 5 min

  constructor(private firestoreService: FirestoreService, private currentDataService: CurrentDataService, private userService: UserService) { }

  ngOnInit(): void {
    // this.user$ = this.firestoreService.getUser(this.userService.uid);
    // this.user$.subscribe((user: User) => this.userService.set(user));

    this.users$ = this.firestoreService.getCollection('users');
    this.users$.pipe(take(1)).subscribe((users) => this.currentDataService.setUsers(users))

    this.updateLastLogin();

    setInterval(() => {
      this.updateLastLogin();
    }, this.updateLastLoginTime);
  }

  updateLastLogin() {
    this.firestoreService.updateLastLogin(new Date())
  }
}