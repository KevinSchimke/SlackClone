import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  user$: any;

  constructor(private firestoreService: FirestoreService, private currentDataService: CurrentDataService, private route: Router) { }

  ngOnInit(): void {
    console.log('route is', this.route);

    this.user$ = this.firestoreService.getUser();
    this.user$.subscribe((user: User) => {
      this.currentDataService.setUser(user);
    });
  }
}
