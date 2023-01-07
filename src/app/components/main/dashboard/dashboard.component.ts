import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(public createChannelService: FirestoreService){
  }
}
