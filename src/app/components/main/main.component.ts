import { Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  user$: Observable<any> = EMPTY;
  users$: Observable<any> = EMPTY;

  constructor(private firestoreService: FirestoreService, private currentDataService: CurrentDataService) { }

  ngOnInit(): void {
    this.user$ = this.firestoreService.getUser();
    this.user$.subscribe((user: User) => this.currentDataService.setUser(user));
    this.users$ = this.firestoreService.getCollection('users');
    this.users$.subscribe((users) => {
      this.currentDataService.setUsers(users)
    });
    console.log('main name is', this.currentDataService.currentUser.name);

  }
}
