import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';

@Component({
  selector: 'app-workspace-bar',
  templateUrl: './workspace-bar.component.html',
  styleUrls: ['./workspace-bar.component.scss']
})
export class WorkspaceBarComponent {
constructor(public createChannelService: FirestoreService){}
}
