import { Component } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/app/models/channel.class';
import { SidenavToggleService } from 'src/app/service/sidenav-toggle/sidenav-toggle.service';
import { FirestoreService } from 'src/app/service/firebase/firestore.service';
import { EMPTY, Observable, of } from 'rxjs';

@Component({
  selector: 'app-channel-bar',
  templateUrl: './channel-bar.component.html',
  styleUrls: ['./channel-bar.component.scss']
})
export class ChannelBarComponent {
  isGoToThreadHovered = false;
  channelId: string = '';
  // channel: Channel;
  collData$: any = '';

  constructor(public sidenavToggler: SidenavToggleService, private route: ActivatedRoute, private firestore: Firestore, public fireService: FirestoreService) { 
    this.collData$ = of({});
  }

  ngOnInit(): void {
    console.log(this.route.params);
    this.route.params.subscribe((param: any) => this.subscribeCurrentChannel(param));
  }

  subscribeCurrentChannel(param: any){
    console.log(param);
    // this.channel.id = param.id;
    let coll = collection(this.firestore, 'channels/'+param.id+'/ThreadCollection');
    this.collData$ = this.fireService.getCollection('channels/'+param.id+'/ThreadCollection');
    console.log(this.collData$);
    // let docRef = doc(coll, this.userID);
    // let user$ = docData(docRef);
  }
}
